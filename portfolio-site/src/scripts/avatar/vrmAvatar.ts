import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import {
	VRMLoaderPlugin,
	VRMUtils,
	type VRM,
} from "@pixiv/three-vrm";
import {
	VRMAnimationLoaderPlugin,
	createVRMAnimationClip,
	type VRMAnimation,
} from "@pixiv/three-vrm-animation";

const LOAD_TIMEOUT_MS = 15_000;

const mixamoBoneMap: Record<string, Parameters<VRM["humanoid"]["getNormalizedBoneNode"]>[0]> = {
	mixamorigHips: "hips",
	mixamorigSpine: "spine",
	mixamorigSpine1: "chest",
	mixamorigSpine2: "upperChest",
	mixamorigNeck: "neck",
	mixamorigHead: "head",
	mixamorigLeftShoulder: "leftShoulder",
	mixamorigLeftArm: "leftUpperArm",
	mixamorigLeftForeArm: "leftLowerArm",
	mixamorigLeftHand: "leftHand",
	mixamorigRightShoulder: "rightShoulder",
	mixamorigRightArm: "rightUpperArm",
	mixamorigRightForeArm: "rightLowerArm",
	mixamorigRightHand: "rightHand",
	mixamorigLeftUpLeg: "leftUpperLeg",
	mixamorigLeftLeg: "leftLowerLeg",
	mixamorigLeftFoot: "leftFoot",
	mixamorigRightUpLeg: "rightUpperLeg",
	mixamorigRightLeg: "rightLowerLeg",
	mixamorigRightFoot: "rightFoot",
};

// The FBX contains useful finger rotations. Retarget these through the same
// rest-pose correction as the major body, while deliberately excluding toes.
for (const side of ["Left", "Right"] as const) {
	const vrmSide = side.toLowerCase() as "left" | "right";
	for (const [mixamoFinger, vrmFinger] of [
		["Thumb", "Thumb"],
		["Index", "Index"],
		["Middle", "Middle"],
		["Ring", "Ring"],
		["Pinky", "Little"],
	] as const) {
		for (let joint = 1; joint <= 3; joint += 1) {
			const segment = joint === 1 ? "Proximal" : joint === 2 ? "Intermediate" : "Distal";
			mixamoBoneMap[`mixamorig${side}Hand${mixamoFinger}${joint}`] =
				`${vrmSide}${vrmFinger}${segment}` as Parameters<VRM["humanoid"]["getNormalizedBoneNode"]>[0];
		}
	}
}

type FbxRetargetBinding = {
	source: THREE.Object3D;
	target: THREE.Object3D;
	sourceRestWorld: THREE.Quaternion;
	targetRestWorld: THREE.Quaternion;
};

type AvatarBehaviourState = "idle";

type NavigatorWithDeviceInfo = Navigator & {
	deviceMemory?: number;
	connection?: { saveData?: boolean };
};

/**
 * Keep the image on reduced-motion, data-saving, very-low-memory, or clearly
 * constrained mobile devices. Other mobile devices may use the avatar.
 */
function shouldUseAvatar(): boolean {
	if (typeof window === "undefined" || typeof WebGLRenderingContext === "undefined") return false;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

	const nav = navigator as NavigatorWithDeviceInfo;
	if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
	if (nav.connection?.saveData) return false;

	const mobile = window.matchMedia("(pointer: coarse) and (max-width: 48rem)").matches;
	if (mobile && navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4) return false;

	const testCanvas = document.createElement("canvas");
	return Boolean(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"));
}

function disposeVrm(vrm: VRM): void {
	VRMUtils.deepDispose(vrm.scene);
}

function createShadowTexture(): THREE.CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;
	const context = canvas.getContext("2d");
	if (context) {
		const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
		gradient.addColorStop(0, "rgba(0, 0, 0, 0.78)");
		gradient.addColorStop(0.38, "rgba(8, 3, 12, 0.58)");
		gradient.addColorStop(0.72, "rgba(52, 26, 66, 0.24)");
		gradient.addColorStop(1, "rgba(52, 26, 66, 0)");
		context.fillStyle = gradient;
		context.fillRect(0, 0, 128, 128);
	}
	return new THREE.CanvasTexture(canvas);
}

export function initVrmAvatar(root: HTMLElement): void {
	if (!shouldUseAvatar()) return;

	const canvas = root.querySelector<HTMLCanvasElement>(".avatar-canvas");
	const modelSrc = root.dataset.modelSrc;
	const idleAnimationSrc = root.dataset.idleAnimationSrc;
	if (!canvas || !modelSrc) return;

	let renderer: THREE.WebGLRenderer | undefined;
	let vrm: VRM | undefined;
	let frameId = 0;
	let isRunning = false;
	let disposed = false;
	let isIntersecting = true;
	let lastTime = performance.now();
	let elapsed = 0;
	let behaviourState: AvatarBehaviourState = "idle";
	let nextBlinkAt = 2 + Math.random() * 4;
	let blinkStartedAt = -1;
	let canBlink = false;
	let pointerTargetX = 0;
	let pointerTargetY = 0;
	let pointerX = 0;
	let pointerY = 0;
	let ambientX = 0;
	let ambientY = 0;
	let nextAmbientAt = 7 + Math.random() * 6;
	let ambientReturnAt = 0;
	let gazeCenterY = 1.5;
	let head: THREE.Object3D | null = null;
	let chest: THREE.Object3D | null = null;
	let chestRestY = 0;
	let hips: THREE.Object3D | null = null;
	let hipsRestX = 0;
	let leftUpperArm: THREE.Object3D | null = null;
	let rightUpperArm: THREE.Object3D | null = null;
	let leftArmRestX = 0;
	let rightArmRestX = 0;
	let leftShoulder: THREE.Object3D | null = null;
	let rightShoulder: THREE.Object3D | null = null;
	let leftShoulderRestZ = 0;
	let rightShoulderRestZ = 0;
	let modelSize: THREE.Vector3 | null = null;
	let modelCenterX = 0;
	let shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
	let mixer: THREE.AnimationMixer | null = null;
	let fbxSource: THREE.Group | null = null;
	let fbxRetargetBindings: FbxRetargetBinding[] | null = null;
	const canTrackPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const pointerHost = root.closest<HTMLElement>(".hero") ?? root;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
	const clockTarget = new THREE.Vector3();
	const avatarRoot = new THREE.Group();
	const gazeTarget = new THREE.Object3D();
	const headEuler = new THREE.Euler();
	const headTargetQuaternion = new THREE.Quaternion();
	const sourceWorldQuaternion = new THREE.Quaternion();
	const sourceRestInverse = new THREE.Quaternion();
	const desiredTargetWorld = new THREE.Quaternion();
	const targetParentWorldInverse = new THREE.Quaternion();
	scene.add(avatarRoot);
	scene.add(gazeTarget);

	const fitFullBodyCamera = () => {
		if (!modelSize) return;
		const height = modelSize.y;
		const targetY = height * 0.68;
		// Desktop intentionally uses an upper-leg/torso composition so the
		// character stays prominent without pushing the hero below the fold.
		const framedHeight = height * 0.68;
		const framedWidth = modelSize.x * 1.08;
		const verticalFov = THREE.MathUtils.degToRad(camera.fov);
		const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
		const verticalDistance = framedHeight / (2 * Math.tan(verticalFov / 2));
		const horizontalDistance = framedWidth / (2 * Math.tan(horizontalFov / 2));
		const distance = Math.max(verticalDistance, horizontalDistance, 1.5);
		clockTarget.set(modelCenterX, targetY, 0);
		// Put the lens at Matthew's measured head/eye level rather than at the
		// model midpoint, then aim slightly down toward the upper torso.
		camera.position.set(modelCenterX, gazeCenterY, distance);
		camera.lookAt(clockTarget);
	};

	const ambient = new THREE.HemisphereLight(0xffffff, 0x5c6680, 2.1);
	const key = new THREE.DirectionalLight(0xffffff, 2.4);
	key.position.set(1.5, 2.8, 3);
	const fill = new THREE.DirectionalLight(0xd9c9ff, 0.45);
	fill.position.set(-2, 1.4, 1.5);
	scene.add(ambient, key, fill);

	const resize = () => {
		if (!renderer) return;
		const width = Math.max(1, root.clientWidth);
		const height = Math.max(1, root.clientHeight);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height, false);
		fitFullBodyCamera();
	};

	const stopLoop = () => {
		if (frameId) cancelAnimationFrame(frameId);
		frameId = 0;
		isRunning = false;
	};

	const render = (now: number) => {
		if (disposed || !renderer || !vrm || !isIntersecting || document.visibilityState !== "visible") {
			stopLoop();
			return;
		}

		// Schedule first so a non-rendering behavior fault cannot silently turn a
		// successfully displayed avatar into a permanently frozen first frame.
		frameId = requestAnimationFrame(render);

		const delta = Math.min((now - lastTime) / 1000, 0.05);
		lastTime = now;
		elapsed += delta;
		mixer?.update(delta);
		if (fbxSource && fbxRetargetBindings) {
			fbxSource.updateWorldMatrix(true, true);
			vrm.scene.updateWorldMatrix(true, true);
			for (const binding of fbxRetargetBindings) {
				binding.source.getWorldQuaternion(sourceWorldQuaternion);
				sourceRestInverse.copy(binding.sourceRestWorld).invert();
				// Source animated world * inverse(source rest world) gives the
				// authored world-space delta independent of Mixamo local bone axes.
				desiredTargetWorld.copy(sourceWorldQuaternion)
					.multiply(sourceRestInverse)
					.multiply(binding.targetRestWorld);
				if (binding.target.parent) {
					binding.target.parent.getWorldQuaternion(targetParentWorldInverse).invert();
					binding.target.quaternion.copy(targetParentWorldInverse).multiply(desiredTargetWorld);
				} else {
					binding.target.quaternion.copy(desiredTargetWorld);
				}
				binding.target.updateWorldMatrix(false, true);
			}
		}

		if (behaviourState === "idle") {
			if (elapsed >= nextAmbientAt) {
				ambientX = (Math.random() - 0.5) * 0.22;
				ambientY = (Math.random() - 0.5) * 0.12;
				ambientReturnAt = elapsed + 0.7 + Math.random() * 1.1;
				nextAmbientAt = ambientReturnAt + 5 + Math.random() * 8;
			}
			if (ambientReturnAt > 0 && elapsed >= ambientReturnAt) {
				ambientX = 0;
				ambientY = 0;
				ambientReturnAt = 0;
			}

			const smoothing = 1 - Math.exp(-delta * 3.2);
			pointerX = THREE.MathUtils.lerp(pointerX, pointerTargetX + ambientX, smoothing);
			pointerY = THREE.MathUtils.lerp(pointerY, pointerTargetY + ambientY, smoothing);

			if (!mixer) {
				const breath = Math.sin(elapsed * 1.18);
				// Keep the feet planted; breathing is applied through the torso rather
				// than translating the complete character away from the contact shadow.
				avatarRoot.position.y = 0;
				avatarRoot.rotation.x = Math.sin(elapsed * 0.33) * 0.005;
				avatarRoot.rotation.y = Math.sin(elapsed * 0.38) * 0.022;
				avatarRoot.rotation.z = Math.sin(elapsed * 0.27) * 0.009;
				if (chest) {
					chest.position.y = chestRestY + breath * 0.0035;
					chest.rotation.x = breath * 0.012;
					const breathScale = 1 + Math.max(0, breath) * 0.004;
					chest.scale.setScalar(breathScale);
				}
				const weightShift = Math.sin(elapsed * 0.43);
				if (hips) hips.position.x = hipsRestX + weightShift * 0.006;
				if (leftUpperArm) leftUpperArm.rotation.x = leftArmRestX + weightShift * 0.009;
				if (rightUpperArm) rightUpperArm.rotation.x = rightArmRestX - weightShift * 0.009;
				if (leftShoulder) leftShoulder.rotation.z = leftShoulderRestZ + breath * 0.003;
				if (rightShoulder) rightShoulder.rotation.z = rightShoulderRestZ - breath * 0.003;
			}
		}

		if (head) {
			headEuler.set(
				pointerY * 0.022 + Math.sin(elapsed * 0.31) * 0.018,
				pointerX * 0.034 + Math.sin(elapsed * 0.23) * 0.022,
				-pointerX * 0.008 + Math.sin(elapsed * 0.19) * 0.006,
			);
			headTargetQuaternion.setFromEuler(headEuler);
			if (mixer) {
				// The mixer has already applied the authored head pose this frame;
				// compose only the small interactive variation on top of it.
				head.quaternion.multiply(headTargetQuaternion);
			} else {
				head.quaternion.slerp(headTargetQuaternion, 1 - Math.exp(-delta * 2.4));
			}
		}

		// Prefer the model's VRM look-at system for eye movement. The target stays
		// near the camera, limiting gaze to a calm, portrait-scale range.
		gazeTarget.position.set(
			camera.position.x + pointerX * 0.24,
			gazeCenterY - pointerY * 0.12,
			camera.position.z,
		);

		if (canBlink && blinkStartedAt < 0 && elapsed >= nextBlinkAt) blinkStartedAt = elapsed;
		let blink = 0;
		if (blinkStartedAt >= 0) {
			const blinkAge = elapsed - blinkStartedAt;
			blink = blinkAge < 0.065
				? blinkAge / 0.065
				: Math.max(0, 1 - (blinkAge - 0.065) / 0.12);
			if (blinkAge >= 0.185) {
				blinkStartedAt = -1;
				const longerGap = Math.random() < 0.16 ? 2 + Math.random() * 2 : 0;
				nextBlinkAt = elapsed + 2 + Math.random() * 4 + longerGap;
			}
		}
		if (canBlink) vrm.expressionManager?.setValue("blink", blink);
		vrm.update(delta);
		renderer.render(scene, camera);
	};

	const resume = () => {
		if (disposed || !vrm || !renderer || isRunning || !isIntersecting || document.visibilityState !== "visible") return;
		isRunning = true;
		lastTime = performance.now();
		frameId = requestAnimationFrame(render);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!canTrackPointer) return;
		const rect = pointerHost.getBoundingClientRect();
		pointerTargetX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -0.7, 0.7);
		pointerTargetY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -0.65, 0.65);
	};
	const onPointerLeave = () => { pointerTargetX = 0; pointerTargetY = 0; };
	const onVisibilityChange = () => {
		if (document.visibilityState === "visible") resume();
		else stopLoop();
	};

	const intersectionObserver = new IntersectionObserver(([entry]) => {
		isIntersecting = entry?.isIntersecting ?? false;
		if (isIntersecting) resume();
		else stopLoop();
	}, { rootMargin: "100px" });
	const resizeObserver = new ResizeObserver(resize);

	const cleanup = () => {
		if (disposed) return;
		disposed = true;
		stopLoop();
		intersectionObserver.disconnect();
		resizeObserver.disconnect();
		document.removeEventListener("visibilitychange", onVisibilityChange);
		pointerHost.removeEventListener("pointermove", onPointerMove);
		pointerHost.removeEventListener("pointerleave", onPointerLeave);
		window.removeEventListener("pagehide", cleanup);
		vrm && disposeVrm(vrm);
		if (shadow) {
			shadow.geometry.dispose();
			shadow.material.map?.dispose();
			shadow.material.dispose();
		}
		renderer?.dispose();
		mixer?.stopAllAction();
		if (fbxSource) VRMUtils.deepDispose(fbxSource);
	};

	const loadIdleAnimation = (animationSrc: string, targetVrm: VRM) => {
		if (animationSrc.toLowerCase().endsWith(".fbx")) {
			new FBXLoader().load(animationSrc, (source) => {
				if (disposed || vrm !== targetVrm) return;
				const sourceClip = source.animations[0];
				if (!sourceClip) return;

				// Capture both rigs in their authoritative rest poses. Preserve the
				// current manual pose so it remains the procedural/failure fallback.
				const fallbackPose = targetVrm.humanoid.getNormalizedPose();
				targetVrm.humanoid.resetNormalizedPose();
				targetVrm.update(0);
				targetVrm.scene.updateWorldMatrix(true, true);
				source.updateWorldMatrix(true, true);

				const bindings: FbxRetargetBinding[] = [];
				for (const [sourceName, humanBoneName] of Object.entries(mixamoBoneMap)) {
					const sourceNode = source.getObjectByName(sourceName);
					const targetNode = targetVrm.humanoid.getNormalizedBoneNode(humanBoneName);
					if (!sourceNode || !targetNode) continue;
					bindings.push({
						source: sourceNode,
						target: targetNode,
						sourceRestWorld: sourceNode.getWorldQuaternion(new THREE.Quaternion()),
						targetRestWorld: targetNode.getWorldQuaternion(new THREE.Quaternion()),
					});
				}

				targetVrm.humanoid.setNormalizedPose(fallbackPose);
				targetVrm.update(0);
				if (bindings.length < 12) {
					VRMUtils.deepDispose(source);
					return;
				}
				fbxSource = source;
				fbxRetargetBindings = bindings;
				mixer = new THREE.AnimationMixer(source);
				mixer.clipAction(sourceClip)
					.setLoop(THREE.LoopRepeat, Infinity)
					.reset()
					.fadeIn(0.35)
					.play();
			}, undefined, () => {
				// Procedural idle remains active when the optional FBX fails.
			});
			return;
		}

		const animationLoader = new GLTFLoader();
		animationLoader.register((parser) => new VRMAnimationLoaderPlugin(parser));
		animationLoader.load(animationSrc, (gltf) => {
			if (disposed || vrm !== targetVrm) return;
			const vrmAnimations = gltf.userData.vrmAnimations as VRMAnimation[] | undefined;
			const vrmAnimation = vrmAnimations?.[0];
			if (!vrmAnimation) return;
			const clip = createVRMAnimationClip(vrmAnimation, targetVrm);

			// Preserve vertical posture variation while removing locomotion/drift
			// from the normalized hips translation track.
			const hipsName = targetVrm.humanoid.getNormalizedBoneNode("hips")?.name;
			const hipsTrack = hipsName
				? clip.tracks.find((track) => track.name === `${hipsName}.position`)
				: undefined;
			if (hipsTrack instanceof THREE.VectorKeyframeTrack && hipsTrack.values.length >= 3) {
				const originX = hipsTrack.values[0];
				const originZ = hipsTrack.values[2];
				for (let index = 0; index < hipsTrack.values.length; index += 3) {
					hipsTrack.values[index] = originX;
					hipsTrack.values[index + 2] = originZ;
				}
			}

			mixer = new THREE.AnimationMixer(targetVrm.scene);
			mixer.clipAction(clip)
				.setLoop(THREE.LoopRepeat, Infinity)
				.reset()
				.fadeIn(0.35)
				.play();
		}, undefined, () => {
			// Procedural idle remains active when an optional authored clip fails.
		});
	};

	try {
		renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
		renderer.setClearColor(0x000000, 0);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		resize();

		const loader = new GLTFLoader();
		loader.register((parser) => new VRMLoaderPlugin(parser));
		const timeout = window.setTimeout(cleanup, LOAD_TIMEOUT_MS);

		loader.load(modelSrc, (gltf) => {
			window.clearTimeout(timeout);
			const loadedVrm = gltf.userData.vrm as VRM | undefined;
			const activeRenderer = renderer;
			if (!loadedVrm || !activeRenderer || disposed) {
				if (loadedVrm) disposeVrm(loadedVrm);
				return;
			}

			vrm = loadedVrm;
			VRMUtils.removeUnnecessaryVertices(vrm.scene);
			VRMUtils.combineSkeletons(vrm.scene);
			VRMUtils.rotateVRM0(vrm);
			avatarRoot.add(vrm.scene);

			// VRM files commonly load in a T-pose. Relax the arms so the model reads
			// as a portrait and does not fill the frame horizontally.
			leftUpperArm = vrm.humanoid.getNormalizedBoneNode("leftUpperArm");
			rightUpperArm = vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
			const leftLowerArm = vrm.humanoid.getNormalizedBoneNode("leftLowerArm");
			const rightLowerArm = vrm.humanoid.getNormalizedBoneNode("rightLowerArm");
			leftShoulder = vrm.humanoid.getNormalizedBoneNode("leftShoulder");
			rightShoulder = vrm.humanoid.getNormalizedBoneNode("rightShoulder");
			if (leftShoulder) leftShoulder.rotation.z = Math.PI * 0.015;
			if (rightShoulder) rightShoulder.rotation.z = -Math.PI * 0.015;
			if (leftUpperArm) leftUpperArm.rotation.z = Math.PI * 0.45;
			if (rightUpperArm) rightUpperArm.rotation.z = -Math.PI * 0.45;
			if (leftUpperArm) leftUpperArm.rotation.x = Math.PI * 0.025;
			if (rightUpperArm) rightUpperArm.rotation.x = Math.PI * 0.025;
			if (leftLowerArm) leftLowerArm.rotation.y = -Math.PI * 0.085;
			if (rightLowerArm) rightLowerArm.rotation.y = Math.PI * 0.085;
			if (leftUpperArm) leftArmRestX = leftUpperArm.rotation.x;
			if (rightUpperArm) rightArmRestX = rightUpperArm.rotation.x;
			if (leftShoulder) leftShoulderRestZ = leftShoulder.rotation.z;
			if (rightShoulder) rightShoulderRestZ = rightShoulder.rotation.z;
			head = vrm.humanoid.getNormalizedBoneNode("head");
			chest = vrm.humanoid.getNormalizedBoneNode("chest")
				?? vrm.humanoid.getNormalizedBoneNode("spine");
			hips = vrm.humanoid.getNormalizedBoneNode("hips");
			if (chest) chestRestY = chest.position.y;
			if (hips) hipsRestX = hips.position.x;
			// Transfer the normalized relaxed pose to the rendered skeleton before
			// measuring. Otherwise the camera fits the much wider source A/T-pose.
			vrm.update(0);
			vrm.scene.updateWorldMatrix(true, true);

			// Ground the feet at Y=0 using the posed model's measured lower bound.
			const initialBounds = new THREE.Box3().setFromObject(vrm.scene);
			vrm.scene.position.y -= initialBounds.min.y;
			vrm.scene.updateWorldMatrix(true, true);
			const groundedBounds = new THREE.Box3().setFromObject(vrm.scene);
			modelSize = groundedBounds.getSize(new THREE.Vector3());
			modelCenterX = groundedBounds.getCenter(new THREE.Vector3()).x;
			if (head) gazeCenterY = head.getWorldPosition(clockTarget).y;

			// A tiny radial-gradient texture provides a soft contact shadow without
			// enabling lights, shadow maps, or additional render passes.
			const leftFoot = vrm.humanoid.getNormalizedBoneNode("leftFoot");
			const rightFoot = vrm.humanoid.getNormalizedBoneNode("rightFoot");
			const leftFootPosition = new THREE.Vector3();
			const rightFootPosition = new THREE.Vector3();
			leftFoot?.getWorldPosition(leftFootPosition);
			rightFoot?.getWorldPosition(rightFootPosition);
			const measuredStance = Math.abs(leftFootPosition.x - rightFootPosition.x);
			const stanceWidth = Math.max(measuredStance + modelSize.y * 0.08, modelSize.y * 0.18);
			const shadowWidth = stanceWidth * 1.75;
			const shadowCenterX = leftFoot && rightFoot
				? (leftFootPosition.x + rightFootPosition.x) * 0.5
				: modelCenterX;
			const shadowCenterZ = leftFoot && rightFoot
				? (leftFootPosition.z + rightFootPosition.z) * 0.5
				: groundedBounds.getCenter(clockTarget).z;
			const shadowTexture = createShadowTexture();
			const shadowMaterial = new THREE.MeshBasicMaterial({
				map: shadowTexture,
				transparent: true,
				opacity: 0.9,
				depthWrite: false,
				toneMapped: false,
			});
			shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMaterial);
			shadow.rotation.x = -Math.PI / 2;
			shadow.position.set(shadowCenterX, 0.001, shadowCenterZ);
			shadow.scale.set(shadowWidth, shadowWidth * 0.42, 1);
			shadow.renderOrder = -1;
			scene.add(shadow);

			fitFullBodyCamera();
			if (vrm.lookAt) {
				vrm.lookAt.target = gazeTarget;
				gazeTarget.position.set(camera.position.x, gazeCenterY, camera.position.z);
			}
			if (idleAnimationSrc) loadIdleAnimation(idleAnimationSrc, vrm);

			// The installed runtime exposes the VRM 0 preset as `blink`. Start with
			// a near-immediate natural blink so expression activity is observable.
			const blinkExpression = vrm.expressionManager?.getExpression("blink");
			canBlink = Boolean(blinkExpression?.binds.length);
			if (canBlink) nextBlinkAt = elapsed + 0.65;

			// Render before revealing so the transparent canvas can never flash blank/black.
			vrm.update(0);
			activeRenderer.render(scene, camera);
			root.dataset.avatarReady = "";
			resume();
		}, undefined, cleanup);

		intersectionObserver.observe(root);
		resizeObserver.observe(root);
		document.addEventListener("visibilitychange", onVisibilityChange);
		if (canTrackPointer) {
			pointerHost.addEventListener("pointermove", onPointerMove, { passive: true });
			pointerHost.addEventListener("pointerleave", onPointerLeave);
		}
		window.addEventListener("pagehide", cleanup, { once: true });
	} catch {
		cleanup();
	}
}
