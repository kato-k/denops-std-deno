import { Denops } from "../deps.ts";

/**
 * Vim variable groups
 *
 * g - Global variables
 * b - Buffer local variables
 * w - Window local variables
 * t - Tab page local variables
 * v - Vim's variables
 *
 */
export type VariableGroups = "g" | "b" | "w" | "t" | "v";

export async function getVar<T = unknown>(
  denops: Denops,
  group: VariableGroups,
  prop: string,
  defaultValue?: T,
): Promise<T | null> {
  const result = await denops.eval(`get(${group}:, name, value)`, {
    name: prop,
    value: defaultValue ?? null,
  });
  // deno-lint-ignore no-explicit-any
  return result as any;
}

export async function setVar<T = unknown>(
  denops: Denops,
  group: VariableGroups,
  prop: string,
  value: T,
): Promise<void> {
  const name = `${group}:${prop}`;
  await denops.cmd(`let ${name} = value`, {
    value,
  });
}

export async function removeVar(
  denops: Denops,
  group: VariableGroups,
  prop: string,
): Promise<void> {
  const name = `${group}:${prop}`;
  await denops.cmd(`unlet ${name}`);
}

export class VariableHelper {
  #denops: Denops;
  #group: VariableGroups;

  constructor(denops: Denops, group: VariableGroups) {
    this.#denops = denops;
    this.#group = group;
  }

  async get<T = unknown>(prop: string, defaultValue?: T): Promise<T | null> {
    return await getVar(this.#denops, this.#group, prop, defaultValue);
  }

  async set<T = unknown>(prop: string, value: T): Promise<void> {
    await setVar(this.#denops, this.#group, prop, value);
  }

  async remove(prop: string): Promise<void> {
    await removeVar(this.#denops, this.#group, prop);
  }
}
