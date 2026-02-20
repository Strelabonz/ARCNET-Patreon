import fs from "node:fs/promises"


async function main(){
  const names = ['mrow','strelz','surfs up','actions']
  
  const tempFile = 'out/patrons.txt.tmp'
  const txtFile = 'out/patrons.txt'

  await fs.mkdir("out", { recursive: true });
  await fs.writeFile(tempFile, names.join("\n") + "\n");
  await fs.rename(tempFile, txtFile);
}

main()
