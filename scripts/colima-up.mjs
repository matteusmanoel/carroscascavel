import { execFileSync } from "node:child_process";

// Colima floor for this repo's default stack (one Postgres 16).
// Memory below 2GiB starves the guest plus dockerd. Disk is not passed:
// an existing VM cannot shrink, and the 100GiB cap is a sparse file.
const CPU = "1";
const MEMORY = "2";

function colimaIsRunning() {
  try {
    execFileSync("colima", ["status"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (!colimaIsRunning()) {
  execFileSync("colima", ["start", "--cpu", CPU, "--memory", MEMORY], {
    stdio: "inherit",
  });
}

execFileSync("docker-compose", ["up", "-d", "db"], { stdio: "inherit" });
