// English-first records transcribed from approved supplemental PDFs.
// Keep this separate from the offline-index import so book-only additions and
// source-specific amendments remain auditable.
export const SUPPLEMENTAL_MERITS_EN = [
  {
    id: "ctl-kith-kin:dramaturge",
    name: "Dramaturge",
    ratings: [3],
    line: "CtL",
    sourceId: "ctl-kith-kin",
    source: "Kith and Kin",
    category: "Changeling",
    prerequisites: "Wits •••, Expression •••, Subterfuge •••",
    description: "When the changeling fulfills a Contract's Loophole while holding an object with strong dramaturgy appropriate to that Contract, she may either apply one additional Seeming benefit she does not possess or make the invocation reflexive without paying additional Glamour. An ordinary object supports three Common uses or one Royal use before its connection is exhausted. An Icon grants both benefits at once and is then destroyed. The changeling also gains 9-again on rolls to perform a galoshin.",
    page: 69,
  },
  {
    id: "ctl-kith-kin:understudy",
    name: "Understudy",
    ratings: [3],
    line: "CtL",
    sourceId: "ctl-kith-kin",
    source: "Kith and Kin",
    category: "Changeling",
    prerequisites: "Dramaturge, Expression ••••",
    description: "As an instant action, the changeling dons or brandishes an item dramaturgically representative of another changeling present in the scene, or one whose Icon she possesses. For the scene, whenever either character satisfies a Contract's Loophole, the other does too. When her counterpart invokes a Contract through its Loophole, the dramaturge may copy onto herself any effects that target only the Contract's user. Choosing a new counterpart ends the prior link.",
    page: 69,
  },
] as const;
