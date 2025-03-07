//@ts-check

import { exists, exec, getFiles } from "./utils.js";
import { createBuilder, createFxmanifest } from "@overextended/fx-utils";
import { readdir } from "fs/promises";

const watch = process.argv.includes("--watch");
const dropLabels = ["$BROWSER"];

if (!watch) dropLabels.push("$DEV");

async function getTypeScriptFiles(directory) {
  try {
    const files = await readdir(directory, { withFileTypes: true });
    const tsFiles = files
      .filter((file) => file.isFile() && file.name.endsWith(".ts"))
      .map((file) => `${directory}/${file.name}`);
    return tsFiles;
  } catch (err) {
    console.error(`Error reading directory ${directory}:`, err);
    return [];
  }
}

async function createBuildConfig() {
  const serverFiles = await getTypeScriptFiles("src/server");
  const clientFiles = await getTypeScriptFiles("src/client");

  const serverConfigs = serverFiles.map((file) => ({
    name: file.replace("src/", "").replace(".ts", ""),
    options: {
      platform: /** @type {const} */ ("node"),
      target: ["node22"],
      format: /** @type {const} */ ("cjs"),
      dropLabels: [...dropLabels, "$CLIENT"],
      entryPoints: [file],
    },
  }));

  const clientConfigs = clientFiles.map((file) => ({
    name: file.replace("src/", "").replace(".ts", ""),
    options: {
      platform: /** @type {const} */ ("browser"),
      target: ["es2021"],
      format: /** @type {const} */ ("iife"),
      dropLabels: [...dropLabels, "$SERVER"],
      entryPoints: [file],
    },
  }));

  return [...serverConfigs, ...clientConfigs];
}

async function build() {
  const buildConfigs = await createBuildConfig();

  createBuilder(
    watch,
    {
      keepNames: true,
      legalComments: "inline",
      bundle: true,
      treeShaking: true,
    },
    buildConfigs,
    async (outfiles) => {
      const files = await getFiles("static", "locales");
      const serverScripts = Object.entries(outfiles)
        .filter(([key]) => key.startsWith("server/"))
        .map(([_, value]) => value);

      const clientScripts = Object.entries(outfiles)
        .filter(([key]) => key.startsWith("client/"))
        .map(([_, value]) => value);

      await createFxmanifest({
        client_scripts: clientScripts,
        server_scripts: serverScripts,
        files: ["locales/*.json", ...files],
      });
    }
  );
}
// add web based code here i removed for myself ...
build();
