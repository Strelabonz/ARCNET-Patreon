import fs from "node:fs/promises"

const TOKEN = process.env.PATREON_ACCESS_TOKEN;
const CAMPAIGN_ID = process.env.PATREON_CAMPAIGN_ID;

if (!TOKEN) throw new Error("Missing PATREON_ACCESS_TOKEN");
if (!CAMPAIGN_ID) throw new Error("Missing PATREON_CAMPAIGN_ID");

const BASE_URL = `https://www.patreon.com/api/oauth2/v2/campaigns/${CAMPAIGN_ID}/members`


async function fetchPatrons() {
    const url = new URL(BASE_URL)
    url.searchParams.set(
        "fields[member]",
        "full_name,patron_status,currently_entitled_amount_cents",
        "page[count]", "1000"
    )

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Patreon API error ${response.status}: ${text}`)
    }

    const json = await response.json()

    const activeMembers = (json.data ?? []).filter(({attributes}) =>
        attributes?.patron_status === "active_patron" &&
        (attributes?.currently_entitled_amount_cents ?? 0) > 0
    )
    const names = activeMembers
        .map(({attributes}) => String(attributes?.full_name ?? "").trim())
        .filter((name) => name.length > 0)

    return Array.from(new Set(names))
}

async function main() {


    const names = await fetchPatrons()

    const tempFile = 'out/patrons.txt.tmp'
    const txtFile = 'out/patrons.txt'

    await fs.mkdir("out", {recursive: true});
    await fs.writeFile(tempFile, names.join("\n") + "\n");
    await fs.rename(tempFile, txtFile);
}

main()
