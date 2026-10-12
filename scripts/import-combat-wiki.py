"""Rebuild the static combat catalog from the repository's offline Codex tables."""

import json
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "lib/catalog-data/combat-equipment.json"
WIKI = ROOT / "pdfSources/codexofdarkness.com/wiki"


class Tables(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []
        self.table = None
        self.row = None
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.table = []
        elif self.table is not None and tag == "tr":
            self.row = []
        elif self.row is not None and tag in ("th", "td"):
            self.cell = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ("th", "td") and self.cell is not None:
            self.row.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.row is not None:
            if self.row:
                self.table.append(self.row)
            self.row = None
        elif tag == "table" and self.table is not None:
            self.tables.append(self.table)
            self.table = None


def tables(name):
    parser = Tables()
    parser.feed((WIKI / f"{name}_(2nd_Edition).html").read_text(encoding="utf-8"))
    return parser.tables


def dots(value):
    if value in ("Unspecified", "?"):
        return 1
    if value in ("N/A", "n/a"):
        return 0
    return value.count("•") if "•" in value else int(value)


def number(value, fallback=0):
    try:
        return int(value)
    except ValueError:
        return fallback


def slug(name):
    text = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


names_pt = {
    "Bomb suit": "Traje antibombas", "Sports gear": "Equipamento esportivo", "Bronze armor": "Armadura de bronze",
    "Heavy hides": "Peles pesadas", "Ichcahuipilli": "Ichcahuipilli", "Linen armor": "Armadura de linho",
    "Lorica segmentata": "Lorica segmentata", "Tlahuiztli": "Tlahuiztli",
    "Blowtorch": "Maçarico", "Board, nailed": "Tábua com pregos", "Club, metal": "Clava de metal",
    "Knife, hunting": "Faca de caça", "Knife, small": "Faca pequena", "Nightstick": "Cassetete policial",
    "Nunchaku": "Nunchaku", "Shield, improvised": "Escudo improvisado", "Shovel": "Pá",
    "Sledgehammer": "Marreta", "Staff": "Bastão longo", "Tiger claws": "Garras de tigre",
    "Whip": "Chicote", "Axe, battle": "Machado de batalha", "Axe, large": "Machado grande",
    "Axe, small": "Machado pequeno", "Catchpole": "Forquilha de captura", "Club": "Clava",
    "Kusari Gama (chain)": "Kusari gama (corrente)", "Kusari Gama (sickle)": "Kusari gama (foice)",
    "Macuahuitl": "Macuahuitl", "Shield, scutum": "Escudo scutum", "Spear, long": "Lança longa",
    "Spear, pilum": "Lança pilum", "Sword, chopping": "Espada cortante", "Sword, gladius": "Espada gládio",
    "Sword, great": "Espadão", "Sword, katana": "Katana", "Sword, long": "Espada longa",
    "Sword, stabbing": "Espada de estocada", "Sword, swerdam": "Espada swerdam", "Tetsubo": "Tetsubō",
    "Rifle, big game": "Rifle de caça pesada", "Atlatl": "Propulsor de lança", "Bow, short": "Arco curto",
    "Bow, long": "Arco longo", "Bow, compound": "Arco composto", "Bow, mesoamerican": "Arco mesoamericano",
    "Bow, neolithic": "Arco neolítico", "Crossbow, gastraphetes": "Besta gastrafeta", "Javelin": "Dardo",
    "Sling, mesoamerican": "Funda mesoamericana", "Sling, neolithic": "Funda neolítica",
    "Pistol, flintlock": "Pistola de pederneira", "Musket, flintlock": "Mosquete de pederneira",
    "Frag, Standard": "Granada de fragmentação padrão", "Frag, Heavy": "Granada de fragmentação pesada",
    "Molotov": "Coquetel molotov", "Pipe Bomb": "Bomba de cano", "Smoke": "Granada de fumaça",
    "Stun": "Granada de atordoamento", "Thermite": "Granada de termita",
    "White Phosphorous": "Granada de fósforo branco",
}

coverage_pt = {
    "Torso": "Tronco", "Torso, arms": "Tronco e braços", "Torso, arms, legs": "Tronco, braços e pernas",
    "Torso, arms, head": "Tronco, braços e cabeça", "Head": "Cabeça", "Unspecified": "Não especificada",
}

details_pt = {
    "Two-handed, 9-Again": "Duas mãos; 9-novamente", "Blinding, burning, piercing 2": "Cegante; queimadura; perfuração 2",
    "Stunning, -1 Durability": "Atordoante; Durabilidade -1", "Brawl": "Usa Briga", "Stunning": "Atordoante",
    "Grappling": "Agarrão", "Crafts or Survival +1": "+1 em Ofícios ou Sobrevivência",
    "Throwable, aerodynamic": "Arremessável; aerodinâmica", "Shielding": "Proteção com escudo",
    "Knockdown": "Derrubar", "Knockdown, stunning": "Derrubar; atordoante",
    "Two-handed, knockdown, reaching": "Duas mãos; derrubar; alcance corpo a corpo",
    "-3 called shot requires 5 damage to impale": "Ataque localizado -3; exige 5 pontos de dano para empalar",
    "Stunning, doesn't apply successes as damage": "Atordoante; sucessos não aumentam o dano",
    "+1 Defense": "+1 Defesa", "Grappling, stunning, uses Dexterity": "Agarrão; atordoante; usa Destreza",
    "Grappling, reaching": "Agarrão; alcance corpo a corpo", "One-handed": "Uma mão",
    "Piercing 1": "Perfuração 1", "Two-handed without Strength ���, reaching, throwable": "Duas mãos sem Força 3; alcance corpo a corpo; arremessável",
    "+1 Defense, reaching": "+1 Defesa; alcance corpo a corpo", "Reaching, throwable": "Alcance corpo a corpo; arremessável",
    "9-Again to call shots": "9-novamente em ataques localizados", "Two-handed, 9-Again": "Duas mãos; 9-novamente",
    "Durability +1": "Durabilidade +1", "Autofire": "Disparo automático", "Stun": "Atordoante",
    "9-Again": "9-novamente", "Three turns to reload; can impale as per stake": "Três turnos para recarregar; pode empalar como estaca",
    "Concealable": "Ocultável", "Knockdown, stun": "Derrubar; atordoar", "Incendiary": "Incendiária",
    "Inaccurate, stun": "Imprecisa; atordoar", "Concealment": "Encobrimento",
    "AP 8, incendiary": "Perfuração de armadura 8; incendiária",
    "AP 3, incendiary, concealment": "Perfuração de armadura 3; incendiária; encobrimento",
    "Stunning, reduce rating and Initiative without Dexterity •••": "Atordoante; reduz graduação e Iniciativa sem Destreza 3",
    "Two-handed without Strength •••, reaching, throwable": "Duas mãos sem Força 3; alcance corpo a corpo; arremessável",
    "Autofire, ex. Steyr-AUG": "Disparo automático; ex.: Steyr-AUG",
    "Ex. Colt .45 ACP": "Ex.: Colt .45 ACP", "Ex. 9mm Glock": "Ex.: Glock 9 mm",
    "Ex. .44 Magnum": "Ex.: .44 Magnum", "Ex. .38 Special": "Ex.: .38 Special",
    "Ex. Remington M-700": "Ex.: Remington M-700",
    "Stun Ex. Winchester Model 70": "Atordoante; ex.: Winchester Model 70",
    "9-Again, ex. Remington 12-gauge": "9-novamente; ex.: Remington calibre 12",
    "Autofire, ex. 9mm MP-5": "Disparo automático; ex.: MP-5 9 mm",
    "Autofire, ex. Ingram Mac-10": "Disparo automático; ex.: Ingram Mac-10",
    "Range based on (Strength + Size + Archery)": "Alcance baseado em Força + Tamanho + Arquearia",
    "Range based on (Strength + Size + Athletics), less effective against armor": "Alcance baseado em Força + Tamanho + Atletismo; menos eficaz contra armadura",
    "Range based on (Strength + Dexterity + Athletics - 2)": "Alcance baseado em Força + Destreza + Atletismo − 2",
    "Range based on (Strength + Dexterity + Athletics)": "Alcance baseado em Força + Destreza + Atletismo",
}

old = json.loads(CATALOG.read_text(encoding="utf-8"))
old_armor = {item.get("nameEn", item["name"]).casefold(): item for item in old["armors"]}
armor_aliases = {"Flak jacket": "jaqueta-fragmentacao", "Riot gear": "equipamento-antitumulto", "Leather armor": "couro-duro", "Plate armor": "armadura-placas"}
weapon_aliases = {"Axe, fire": "machado-de-incendio", "Stun gun": "arma-de-choque", "Shield, small": "escudo-pequeno", "Shield, large": "escudo-grande"}

armors = []
era = "Modern"
for row in tables("Armor")[0][1:]:
    if len(row) == 1:
        era = row[0]
        continue
    name, general, ballistic, strength, defense, speed, availability, coverage, detail, source = row
    if name == "Helmet" or name.startswith("Shield"):
        continue
    previous = old_armor.get(name.casefold()) or next((item for item in old["armors"] if item["id"] == armor_aliases.get(name)), None)
    item = {
        "id": previous["id"] if previous else slug(name), "name": name,
        "translatedName": previous.get("translatedName", previous["name"]) if previous else names_pt[name], "era": era,
        "general": int(general), "ballistic": int(ballistic), "strength": dots(strength),
        "defense": int(defense), "speed": int(speed), "availability": dots(availability),
        "coverage": coverage, "coveragePt": coverage_pt[coverage], "source": source,
    }
    if detail:
        item["special"] = detail
        item["specialPt"] = {"Concealed/incognito": "Discreta/oculta"}.get(detail, detail)
    armors.append(item)

chain = next(item for item in armors if item["name"] == "Chainmail")
armors.append({**chain, "id": "cota-malha-pernas", "name": "Chainmail (Leg)", "translatedName": "Cota de malha (pernas)",
               "availability": 3, "coverage": "Torso, arms, legs", "coveragePt": "Tronco, braços e pernas"})

weapons = []
seen = set()
for index, table in enumerate(tables("Weapons")[:3]):
    era = "Modern" if index == 0 else "Ranged" if index == 1 else "Grenades"
    for row in table[1:]:
        if len(row) == 1:
            era = row[0]
            continue
        name = row[0]
        if index == 0:
            _, damage, initiative, strength, size, availability, detail, source = row
            category = "Melee"
            ranges = clip = ""
        elif index == 1:
            _, damage, ranges, clip, initiative, strength, size, availability, detail, source = row
            category = "Ranged"
            ranges = ranges.replace(", ", "/")
        else:
            _, damage, blast, force, ranges, strength, initiative, availability, detail, source = row
            category = "Grenades"
            size, clip = "1", ""
        previous = next((item for item in old["weapons"] if item.get("nameEn", item["name"]).casefold() == name.casefold() and str(item["damage"]) == damage and item["id"] not in seen), None)
        previous = previous or next((item for item in old["weapons"] if item["id"] == weapon_aliases.get(name) and item["id"] not in seen), None)
        item_id = previous["id"] if previous else slug(name)
        if item_id in seen:
            item_id += "-two-handed" if "Two-handed" in detail else "-variant"
        seen.add(item_id)
        translated = previous.get("translatedName", previous["name"]) if previous else names_pt.get(name, name)
        item = {"id": item_id, "name": name, "translatedName": translated, "kind": category,
                "damage": int(damage) if damage.isdigit() else damage, "initiative": number(initiative),
                "strength": dots(strength) if "•" in strength or strength.isdigit() else 0,
                "size": number(size, 1), "availability": dots(availability), "source": source}
        if strength == "As built":
            item["strengthText"] = "As built"
            item["strengthTextPt"] = "Conforme construção"
        if size == "Size - 1":
            item["sizeText"] = "Size − 1"
            item["sizeTextPt"] = "Tamanho − 1"
        if ranges:
            item["ranges"] = ranges
        if clip:
            item["clip"] = clip
        if detail:
            item["special"] = detail
            item["specialPt"] = details_pt.get(detail, detail)
        if index == 2:
            item["blastArea"] = number(blast)
            item["force"] = number(force) if force.isdigit() else force
        weapons.append(item)

old["armors"] = armors
old["weapons"] = weapons
CATALOG.write_text(json.dumps(old, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
