import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const LOAD_TIMEOUT_MS = 15_000;
const mixamoBoneMap: Record<string, string> = {
	mixamorigHips: "Hips", mixamorigSpine: "Spine", mixamorigSpine1: "Spine1", mixamorigSpine2: "Spine2",
	mixamorigNeck: "Neck", mixamorigHead: "Head",
	mixamorigLeftShoulder: "LeftShoulder", mixamorigLeftArm: "LeftArm", mixamorigLeftForeArm: "LeftForeArm", mixamorigLeftHand: "LeftHand",
	mixamorigRightShoulder: "RightShoulder", mixamorigRightArm: "RightArm", mixamorigRightForeArm: "RightForeArm", mixamorigRightHand: "RightHand",
	mixamorigLeftUpLeg: "LeftUpLeg", mixamorigLeftLeg: "LeftLeg", mixamorigLeftFoot: "LeftFoot",
	mixamorigRightUpLeg: "RightUpLeg", mixamorigRightLeg: "RightLeg", mixamorigRightFoot: "RightFoot",
};
for (const side of ["Left", "Right"] as const) {
	for (const finger of ["Thumb", "Index", "Middle", "Ring", "Pinky"] as const) {
		for (let joint = 1; joint <= 3; joint += 1) {
			mixamoBoneMap[`mixamorig${side}Hand${finger}${joint}`] = `${side}Hand${finger}${joint}`;
		}
	}
}

type MorphBinding = { mesh: THREE.Mesh; index: number };
type RetargetBinding = { source: THREE.Object3D; target: THREE.Object3D; sourceRestWorld: THREE.Quaternion; targetRestWorld: THREE.Quaternion };
export type AvatarState = "idle" | "listening" | "thinking" | "speaking";
export interface AvatarController {
	setAvatarState(state: AvatarState): void;
	speakAudio(url: string): Promise<void>;
	runExpressionDiagnostic(): Promise<void>;
}
type NavigatorWithDeviceInfo = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function shouldUseAvatar(): boolean {
	if (typeof window === "undefined" || typeof WebGLRenderingContext === "undefined") return false;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
	const nav = navigator as NavigatorWithDeviceInfo;
	if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
	if (nav.connection?.saveData) return false;
	if (window.matchMedia("(pointer: coarse) and (max-width: 48rem)").matches && (navigator.hardwareConcurrency ?? 8) <= 4) return false;
	const testCanvas = document.createElement("canvas");
	return Boolean(testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"));
}

function disposeObject(root: THREE.Object3D): void {
	root.traverse((object) => {
		const mesh = object as THREE.Mesh;
		if (!mesh.isMesh) return;
		mesh.geometry?.dispose();
		for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
			for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
			material.dispose();
		}
	});
}

function createShadowTexture(): THREE.CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 128; canvas.height = 128;
	const context = canvas.getContext("2d");
	if (context) {
		const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
		gradient.addColorStop(0, "rgba(0,0,0,.78)"); gradient.addColorStop(.38, "rgba(8,3,12,.58)");
		gradient.addColorStop(.72, "rgba(52,26,66,.24)"); gradient.addColorStop(1, "rgba(52,26,66,0)");
		context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
	}
	return new THREE.CanvasTexture(canvas);
}

export function initAvatar(root: HTMLElement): AvatarController | undefined {
	if (!shouldUseAvatar()) return;
	const canvas = root.querySelector<HTMLCanvasElement>(".avatar-canvas");
	const modelSrc = root.dataset.modelSrc;
	const idleAnimationSrc = root.dataset.idleAnimationSrc;
	if (!canvas || !modelSrc) return;

	let renderer: THREE.WebGLRenderer | undefined;
	let avatarScene: THREE.Group | null = null;
	let frameId = 0, lastTime = performance.now(), elapsed = 0;
	let isRunning = false, disposed = false, isIntersecting = true, diagnosticActive = false;
	let avatarState: AvatarState = "idle";
	let nextBlinkAt = 2 + Math.random() * 4, blinkStartedAt = -1, mouthLevel = 0;
	let pointerTargetX = 0, pointerTargetY = 0, pointerX = 0, pointerY = 0, ambientX = 0, ambientY = 0;
	let nextAmbientAt = 7 + Math.random() * 6, ambientReturnAt = 0, gazeCenterY = 1.5;
	let modelSize: THREE.Vector3 | null = null, modelCenterX = 0;
	let shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
	let mixer: THREE.AnimationMixer | null = null, fbxSource: THREE.Group | null = null, retargetBindings: RetargetBinding[] | null = null;
	let head: THREE.Object3D | null = null, leftEye: THREE.Object3D | null = null, rightEye: THREE.Object3D | null = null;
	let chest: THREE.Object3D | null = null, hips: THREE.Object3D | null = null;
	let leftUpperArm: THREE.Object3D | null = null, rightUpperArm: THREE.Object3D | null = null;
	let leftShoulder: THREE.Object3D | null = null, rightShoulder: THREE.Object3D | null = null;
	let chestRestY = 0, hipsRestX = 0, leftArmRestX = 0, rightArmRestX = 0, leftShoulderRestZ = 0, rightShoulderRestZ = 0;
	let audio: HTMLAudioElement | null = null, audioContext: AudioContext | null = null, analyser: AnalyserNode | null = null;
	let audioSourceNode: MediaElementAudioSourceNode | null = null, audioSamples: Uint8Array<ArrayBuffer> | null = null;
	let finishCurrentSpeech: (() => void) | null = null, speechRunId = 0;
	const targetRestWorld = new Map<string, THREE.Quaternion>();
	const morphBindings = new Map<string, MorphBinding[]>();
	const mouthMorphs = ["viseme_aa", "viseme_E", "viseme_I", "viseme_O", "viseme_U"];
	const speechMorphs = [...mouthMorphs, "jawOpen", "viseme_PP", "viseme_FF", "viseme_TH", "viseme_DD", "viseme_kk", "viseme_CH", "viseme_SS", "viseme_nn", "viseme_RR"];
	const canTrackPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
	const pointerHost = root.closest<HTMLElement>(".hero") ?? root;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(28, 1, .1, 100);
	const avatarRoot = new THREE.Group();
	const workVector = new THREE.Vector3(), sourceWorld = new THREE.Quaternion(), sourceRestInverse = new THREE.Quaternion();
	const desiredWorld = new THREE.Quaternion(), parentWorldInverse = new THREE.Quaternion(), gazeDelta = new THREE.Quaternion(), eyeDelta = new THREE.Quaternion();
	const headRestLocal = new THREE.Quaternion(), leftEyeRestLocal = new THREE.Quaternion(), rightEyeRestLocal = new THREE.Quaternion();
	const gazeEuler = new THREE.Euler();
	scene.add(avatarRoot);
	const setMorph = (name: string, value: number) => {
		for (const binding of morphBindings.get(name) ?? []) binding.mesh.morphTargetInfluences![binding.index] = value;
	};

	const fitCamera = () => {
		if (!modelSize) return;
		const verticalFov = THREE.MathUtils.degToRad(camera.fov);
		const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
		const distance = Math.max(modelSize.y * .68 / (2 * Math.tan(verticalFov / 2)), modelSize.x * 1.08 / (2 * Math.tan(horizontalFov / 2)), 1.5);
		camera.position.set(modelCenterX, gazeCenterY, distance);
		camera.lookAt(modelCenterX, modelSize.y * .68, 0);
	};
	const ambientLight = new THREE.HemisphereLight(0xffffff, 0x5c6680, 2.1);
	const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(1.5, 2.8, 3);
	const fill = new THREE.DirectionalLight(0xd9c9ff, .45); fill.position.set(-2, 1.4, 1.5);
	scene.add(ambientLight, key, fill);
	const resize = () => {
		if (!renderer) return;
		const width = Math.max(1, root.clientWidth), height = Math.max(1, root.clientHeight);
		camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); fitCamera();
	};
	const stopLoop = () => { if (frameId) cancelAnimationFrame(frameId); frameId = 0; isRunning = false; };

	const render = (now: number) => {
		if (disposed || !renderer || !avatarScene || !isIntersecting || document.visibilityState !== "visible") { stopLoop(); return; }
		frameId = requestAnimationFrame(render);
		const delta = Math.min((now - lastTime) / 1000, .05); lastTime = now; elapsed += delta;
		mixer?.update(delta);
		if (fbxSource && retargetBindings) {
			fbxSource.updateWorldMatrix(true, true); avatarScene.updateWorldMatrix(true, true);
			for (const binding of retargetBindings) {
				binding.source.getWorldQuaternion(sourceWorld); sourceRestInverse.copy(binding.sourceRestWorld).invert();
				desiredWorld.copy(sourceWorld).multiply(sourceRestInverse).multiply(binding.targetRestWorld);
				if (binding.target.parent) {
					binding.target.parent.getWorldQuaternion(parentWorldInverse).invert();
					binding.target.quaternion.copy(parentWorldInverse).multiply(desiredWorld);
				} else binding.target.quaternion.copy(desiredWorld);
				binding.target.updateWorldMatrix(false, true);
			}
		}

		if (elapsed >= nextAmbientAt) {
			ambientX = (Math.random() - .5) * .22; ambientY = (Math.random() - .5) * .12;
			ambientReturnAt = elapsed + .7 + Math.random() * 1.1; nextAmbientAt = ambientReturnAt + 5 + Math.random() * 8;
		}
		if (ambientReturnAt && elapsed >= ambientReturnAt) { ambientX = 0; ambientY = 0; ambientReturnAt = 0; }
		const smoothing = 1 - Math.exp(-delta * 3.2);
		pointerX = THREE.MathUtils.lerp(pointerX, pointerTargetX + ambientX, smoothing);
		pointerY = THREE.MathUtils.lerp(pointerY, pointerTargetY + ambientY, smoothing);

		if (!mixer) {
			const breath = Math.sin(elapsed * 1.18), shift = Math.sin(elapsed * .43);
			avatarRoot.rotation.set(Math.sin(elapsed * .33) * .005, Math.sin(elapsed * .38) * .022, Math.sin(elapsed * .27) * .009);
			if (chest) { chest.position.y = chestRestY + breath * .0035; chest.rotation.x = breath * .012; }
			if (hips) hips.position.x = hipsRestX + shift * .006;
			if (leftUpperArm) leftUpperArm.rotation.x = leftArmRestX + shift * .009;
			if (rightUpperArm) rightUpperArm.rotation.x = rightArmRestX - shift * .009;
			if (leftShoulder) leftShoulder.rotation.z = leftShoulderRestZ + breath * .003;
			if (rightShoulder) rightShoulder.rotation.z = rightShoulderRestZ - breath * .003;
		}

		gazeDelta.setFromEuler(gazeEuler.set(pointerY * .022, pointerX * .034, -pointerX * .008));
		if (head) {
			if (mixer) head.quaternion.multiply(gazeDelta);
			else head.quaternion.copy(headRestLocal).multiply(gazeDelta);
		}
		eyeDelta.setFromEuler(gazeEuler.set(pointerY * .055, pointerX * .09, 0));
		leftEye?.quaternion.copy(leftEyeRestLocal).multiply(eyeDelta);
		rightEye?.quaternion.copy(rightEyeRestLocal).multiply(eyeDelta);

		if (!diagnosticActive && blinkStartedAt < 0 && elapsed >= nextBlinkAt) blinkStartedAt = elapsed;
		let blink = 0;
		if (blinkStartedAt >= 0) {
			const age = elapsed - blinkStartedAt; blink = age < .065 ? age / .065 : Math.max(0, 1 - (age - .065) / .12);
			if (age >= .185) { blinkStartedAt = -1; nextBlinkAt = elapsed + 2 + Math.random() * 4 + (Math.random() < .16 ? 2 + Math.random() * 2 : 0); }
		}
		if (!diagnosticActive) { setMorph("eyeBlinkLeft", blink); setMorph("eyeBlinkRight", blink); }

		if (!diagnosticActive) {
			let target = 0;
			if (avatarState === "speaking" && analyser && audioSamples && audio && !audio.paused) {
				analyser.getByteTimeDomainData(audioSamples); let energy = 0;
				for (const sample of audioSamples) energy += ((sample - 128) / 128) ** 2;
				target = THREE.MathUtils.clamp((Math.sqrt(energy / audioSamples.length) - .018) * 8, 0, .68);
			}
			mouthLevel = THREE.MathUtils.lerp(mouthLevel, target, 1 - Math.exp(-delta * 18));
			for (const name of speechMorphs) setMorph(name, 0);
			if (mouthLevel > .01) {
				const index = Math.floor(elapsed * 6) % mouthMorphs.length, next = (index + 1) % mouthMorphs.length;
				setMorph("jawOpen", mouthLevel * .32); setMorph(mouthMorphs[index], mouthLevel); setMorph(mouthMorphs[next], mouthLevel * .18);
			}
		}
		renderer.render(scene, camera);
	};

	const resume = () => {
		if (disposed || !avatarScene || !renderer || isRunning || !isIntersecting || document.visibilityState !== "visible") return;
		isRunning = true; lastTime = performance.now(); frameId = requestAnimationFrame(render);
	};
	const onPointerMove = (event: PointerEvent) => {
		if (!canTrackPointer) return;
		const rect = pointerHost.getBoundingClientRect();
		pointerTargetX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -.7, .7);
		pointerTargetY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -.65, .65);
	};
	const onPointerLeave = () => { pointerTargetX = 0; pointerTargetY = 0; };
	const onVisibilityChange = () => document.visibilityState === "visible" ? resume() : stopLoop();
	const intersectionObserver = new IntersectionObserver(([entry]) => { isIntersecting = entry?.isIntersecting ?? false; if (isIntersecting) resume(); else stopLoop(); }, { rootMargin: "100px" });
	const resizeObserver = new ResizeObserver(resize);
	const cleanup = () => {
		if (disposed) return; disposed = true; stopLoop(); intersectionObserver.disconnect(); resizeObserver.disconnect();
		document.removeEventListener("visibilitychange", onVisibilityChange); pointerHost.removeEventListener("pointermove", onPointerMove);
		pointerHost.removeEventListener("pointerleave", onPointerLeave); window.removeEventListener("pagehide", cleanup);
		if (avatarScene) disposeObject(avatarScene); if (fbxSource) disposeObject(fbxSource);
		if (shadow) { shadow.geometry.dispose(); shadow.material.map?.dispose(); shadow.material.dispose(); }
		mixer?.stopAllAction(); renderer?.dispose(); speechRunId += 1; finishCurrentSpeech?.(); finishCurrentSpeech = null;
		audio?.pause(); audioSourceNode?.disconnect(); analyser?.disconnect(); void audioContext?.close();
	};

	const setAvatarState = (state: AvatarState) => { avatarState = state; };
	const speakAudio = async (url: string): Promise<void> => {
		const runId = ++speechRunId; finishCurrentSpeech?.(); finishCurrentSpeech = null; audio?.pause();
		audioSourceNode?.disconnect(); analyser?.disconnect();
		if (!audioContext) audioContext = new AudioContext(); if (audioContext.state === "suspended") await audioContext.resume();
		const nextAudio = new Audio(url); nextAudio.preload = "auto"; audio = nextAudio;
		try {
			analyser = audioContext.createAnalyser(); analyser.fftSize = 256; audioSamples = new Uint8Array(analyser.fftSize);
			audioSourceNode = audioContext.createMediaElementSource(nextAudio); audioSourceNode.connect(analyser); analyser.connect(audioContext.destination);
		} catch { analyser = null; audioSamples = null; }
		setAvatarState("speaking");
		try {
			await nextAudio.play();
			await new Promise<void>((resolve, reject) => {
				const finish = () => { nextAudio.removeEventListener("ended", finish); nextAudio.removeEventListener("error", fail); if (finishCurrentSpeech === finish) finishCurrentSpeech = null; resolve(); };
				const fail = () => { finish(); reject(nextAudio.error ?? new Error("Audio playback failed.")); };
				finishCurrentSpeech = finish; nextAudio.addEventListener("ended", finish, { once: true }); nextAudio.addEventListener("error", fail, { once: true });
			});
		} finally {
			if (runId === speechRunId) { mouthLevel = 0; for (const name of speechMorphs) setMorph(name, 0); setAvatarState("idle"); }
		}
	};

	const runExpressionDiagnostic = async (): Promise<void> => {
		if (!avatarScene || diagnosticActive) return;
		const tests: Array<[string, string[]]> = [
			["left blink", ["eyeBlinkLeft"]], ["right blink", ["eyeBlinkRight"]], ["both blink", ["eyeBlinkLeft", "eyeBlinkRight"]],
			["jawOpen", ["jawOpen"]], ...mouthMorphs.map((name) => [name, [name]] as [string, string[]]),
		];
		diagnosticActive = true;
		try {
			for (const [label, names] of tests) {
				for (const name of ["eyeBlinkLeft", "eyeBlinkRight", ...speechMorphs]) setMorph(name, 0);
				for (const name of names) setMorph(name, 1); root.dataset.avatarDiagnostic = label;
				await new Promise((resolve) => window.setTimeout(resolve, 650));
				for (const name of names) setMorph(name, 0); await new Promise((resolve) => window.setTimeout(resolve, 250));
			}
		} finally {
			for (const name of ["eyeBlinkLeft", "eyeBlinkRight", ...speechMorphs]) setMorph(name, 0);
			delete root.dataset.avatarDiagnostic; diagnosticActive = false;
		}
	};

	const loadIdleAnimation = (src: string, targetScene: THREE.Group) => {
		new FBXLoader().load(src, (source) => {
			if (disposed || avatarScene !== targetScene) return;
			const clip = source.animations[0]; if (!clip) return; source.updateWorldMatrix(true, true);
			const bindings: RetargetBinding[] = [];
			for (const [sourceName, targetName] of Object.entries(mixamoBoneMap)) {
				const sourceNode = source.getObjectByName(sourceName), targetNode = targetScene.getObjectByName(targetName), rest = targetRestWorld.get(targetName);
				if (sourceNode && targetNode && rest) bindings.push({ source: sourceNode, target: targetNode, sourceRestWorld: sourceNode.getWorldQuaternion(new THREE.Quaternion()), targetRestWorld: rest.clone() });
			}
			if (bindings.length < 12) { disposeObject(source); return; }
			fbxSource = source; retargetBindings = bindings; mixer = new THREE.AnimationMixer(source);
			mixer.clipAction(clip).setLoop(THREE.LoopRepeat, Infinity).reset().fadeIn(.35).play();
		}, undefined, () => undefined);
	};

	try {
		renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
		renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace; resize();
		const timeout = window.setTimeout(cleanup, LOAD_TIMEOUT_MS);
		new GLTFLoader().load(modelSrc, (gltf) => {
			window.clearTimeout(timeout); if (disposed || !renderer) { disposeObject(gltf.scene); return; }
			avatarScene = gltf.scene; avatarRoot.add(avatarScene); avatarScene.updateWorldMatrix(true, true);
			for (const targetName of Object.values(mixamoBoneMap)) {
				const node = avatarScene.getObjectByName(targetName);
				if (node && !targetRestWorld.has(targetName)) targetRestWorld.set(targetName, node.getWorldQuaternion(new THREE.Quaternion()));
			}
			avatarScene.traverse((object) => {
				const mesh = object as THREE.Mesh;
				if (!mesh.isMesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
				for (const [name, index] of Object.entries(mesh.morphTargetDictionary)) {
					const list = morphBindings.get(name) ?? []; list.push({ mesh, index }); morphBindings.set(name, list);
				}
			});
			head = avatarScene.getObjectByName("Head") ?? null; leftEye = avatarScene.getObjectByName("LeftEye") ?? null; rightEye = avatarScene.getObjectByName("RightEye") ?? null;
			if (head) headRestLocal.copy(head.quaternion); if (leftEye) leftEyeRestLocal.copy(leftEye.quaternion); if (rightEye) rightEyeRestLocal.copy(rightEye.quaternion);
			chest = avatarScene.getObjectByName("Spine1") ?? avatarScene.getObjectByName("Spine") ?? null; hips = avatarScene.getObjectByName("Hips") ?? null;
			leftUpperArm = avatarScene.getObjectByName("LeftArm") ?? null; rightUpperArm = avatarScene.getObjectByName("RightArm") ?? null;
			leftShoulder = avatarScene.getObjectByName("LeftShoulder") ?? null; rightShoulder = avatarScene.getObjectByName("RightShoulder") ?? null;
			const leftForeArm = avatarScene.getObjectByName("LeftForeArm"), rightForeArm = avatarScene.getObjectByName("RightForeArm");
			if (leftShoulder) leftShoulder.rotation.z += Math.PI * .015; if (rightShoulder) rightShoulder.rotation.z -= Math.PI * .015;
			if (leftUpperArm) { leftUpperArm.rotation.z += Math.PI * .45; leftUpperArm.rotation.x += Math.PI * .025; }
			if (rightUpperArm) { rightUpperArm.rotation.z -= Math.PI * .45; rightUpperArm.rotation.x += Math.PI * .025; }
			if (leftForeArm) leftForeArm.rotation.y -= Math.PI * .085; if (rightForeArm) rightForeArm.rotation.y += Math.PI * .085;
			if (chest) chestRestY = chest.position.y; if (hips) hipsRestX = hips.position.x;
			if (leftUpperArm) leftArmRestX = leftUpperArm.rotation.x; if (rightUpperArm) rightArmRestX = rightUpperArm.rotation.x;
			if (leftShoulder) leftShoulderRestZ = leftShoulder.rotation.z; if (rightShoulder) rightShoulderRestZ = rightShoulder.rotation.z;
			avatarScene.updateWorldMatrix(true, true);
			const initialBounds = new THREE.Box3().setFromObject(avatarScene); avatarScene.position.y -= initialBounds.min.y; avatarScene.updateWorldMatrix(true, true);
			const bounds = new THREE.Box3().setFromObject(avatarScene); modelSize = bounds.getSize(new THREE.Vector3()); modelCenterX = bounds.getCenter(new THREE.Vector3()).x;
			if (head) gazeCenterY = head.getWorldPosition(workVector).y;
			const leftFoot = avatarScene.getObjectByName("LeftFoot"), rightFoot = avatarScene.getObjectByName("RightFoot");
			const lp = new THREE.Vector3(), rp = new THREE.Vector3(); leftFoot?.getWorldPosition(lp); rightFoot?.getWorldPosition(rp);
			const shadowWidth = Math.max(Math.abs(lp.x - rp.x) + modelSize.y * .08, modelSize.y * .18) * 1.75;
			const material = new THREE.MeshBasicMaterial({ map: createShadowTexture(), transparent: true, opacity: .9, depthWrite: false, toneMapped: false });
			shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material); shadow.rotation.x = -Math.PI / 2;
			shadow.position.set(leftFoot && rightFoot ? (lp.x + rp.x) / 2 : modelCenterX, .001, leftFoot && rightFoot ? (lp.z + rp.z) / 2 : bounds.getCenter(workVector).z);
			shadow.scale.set(shadowWidth, shadowWidth * .42, 1); shadow.renderOrder = -1; scene.add(shadow);
			fitCamera(); if (idleAnimationSrc) loadIdleAnimation(idleAnimationSrc, avatarScene); nextBlinkAt = elapsed + .65;
			renderer.render(scene, camera); root.dataset.avatarReady = ""; resume();
		}, undefined, cleanup);
		intersectionObserver.observe(root); resizeObserver.observe(root); document.addEventListener("visibilitychange", onVisibilityChange);
		if (canTrackPointer) { pointerHost.addEventListener("pointermove", onPointerMove, { passive: true }); pointerHost.addEventListener("pointerleave", onPointerLeave); }
		window.addEventListener("pagehide", cleanup, { once: true });
	} catch { cleanup(); }
	return { setAvatarState, speakAudio, runExpressionDiagnostic };
}
