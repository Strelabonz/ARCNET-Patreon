import fs from "node:fs/promises"


async function main(){

const res = await fetch("https://www.patreon.com/api/oauth2/v2/campaigns", {
  headers: {
    Authorization: `Bearer ${process.env.PATREON_ACCESS_TOKEN}`,
  },
});

console.log(await res.text());
process.exit(0);
  
  const names = ['mrow','strelz','surfs up','actions']
  
  const tempFile = 'out/patrons.txt.tmp'
  const txtFile = 'out/patrons.txt'

  await fs.mkdir("out", { recursive: true });
  await fs.writeFile(tempFile, names.join("\n") + "\n");
  await fs.rename(tempFile, txtFile);
}

main()
