import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error("Usage: node scripts/run-astro.js <astro-args...>");
	process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const astroBin = path.resolve(__dirname, "..", "node_modules", ".bin", "astro");

const child = spawn(astroBin, args, {
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
