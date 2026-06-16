import { spawn } from "node:child_process";

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error("Usage: node scripts/run-astro.js <astro-args...>");
	process.exit(1);
}

const child = spawn("astro", args, {
	stdio: "inherit",
	env: {
		...process.env,
		ASTRO_TELEMETRY_DISABLED: "1",
		TELEMETRY_DISABLED: "1",
	},
	shell: true,
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 1);
});
