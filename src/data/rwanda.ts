// Rwanda administrative divisions — all 30 districts and their sectors.
// Source: Rwanda Local Government (MINALOC) administrative structure.
export interface RwandaDistrict {
  province: string;
  sectors: string[];
}

export const rwandaDistricts: Record<string, RwandaDistrict> = {
  // City of Kigali
  Gasabo: {
    province: "Kigali",
    sectors: [
      "Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana",
      "Jali", "Kacyiru", "Kimihurura", "Kimironko", "Kinyinya",
      "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga",
    ],
  },
  Kicukiro: {
    province: "Kigali",
    sectors: [
      "Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe",
      "Kicukiro", "Kigarama", "Masaka", "Niboye", "Nyarugunga",
    ],
  },
  Nyarugenge: {
    province: "Kigali",
    sectors: [
      "Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere",
      "Muhima", "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo",
    ],
  },

  // Eastern Province
  Bugesera: {
    province: "Eastern",
    sectors: [
      "Gashora", "Juru", "Kamabuye", "Mareba", "Mayange",
      "Musenyi", "Mwogo", "Ngeruka", "Ntarama", "Nyamata",
      "Nyarugenge", "Rilima", "Ruhuha", "Rweru", "Shyara",
    ],
  },
  Gatsibo: {
    province: "Eastern",
    sectors: [
      "Gasange", "Gatsibo", "Gitoki", "Kabarore", "Kageyo",
      "Kiramuruzi", "Kiziguro", "Muhura", "Murambi", "Ngarama",
      "Nyagihanga", "Remera", "Rugarama", "Rwimbogo",
    ],
  },
  Kayonza: {
    province: "Eastern",
    sectors: [
      "Gahini", "Kabare", "Kabarondo", "Mukarange", "Murama",
      "Murundi", "Mwiri", "Ndego", "Nyamirama", "Rukara",
      "Ruramira", "Rwinkwavu",
    ],
  },
  Kirehe: {
    province: "Eastern",
    sectors: [
      "Gahara", "Gatore", "Kigarama", "Kigina", "Kirehe",
      "Mahama", "Mpanga", "Musaza", "Mushikiri", "Nasho",
      "Nyamugari", "Nyarubuye",
    ],
  },
  Ngoma: {
    province: "Eastern",
    sectors: [
      "Gashanda", "Jarama", "Karembo", "Kazo", "Kibungo",
      "Mugesera", "Murama", "Mutenderi", "Remera", "Rukira",
      "Rukumberi", "Rurenge", "Sake", "Zaza",
    ],
  },
  Nyagatare: {
    province: "Eastern",
    sectors: [
      "Gatunda", "Karama", "Karangazi", "Katabagemu", "Kiyombe",
      "Matimba", "Mimuli", "Mukama", "Musheli", "Nyagatare",
      "Rukomo", "Rwempasha", "Rwimiyaga", "Tabagwe",
    ],
  },
  Rwamagana: {
    province: "Eastern",
    sectors: [
      "Fumbwe", "Gahengeri", "Gishari", "Karenge", "Kigabiro",
      "Muhazi", "Munyaga", "Munyiginya", "Musha", "Muyumbu",
      "Mwulire", "Nyakariro", "Nzige", "Rubona",
    ],
  },

  // Northern Province
  Burera: {
    province: "Northern",
    sectors: [
      "Bungwe", "Butaro", "Cyanika", "Cyeru", "Gahunga",
      "Gatebe", "Gitovu", "Kagogo", "Kinoni", "Kinyababa",
      "Kivuye", "Nemba", "Rugarama", "Rugendabari", "Ruhunde",
      "Rusarabuye", "Rwerere",
    ],
  },
  Gakenke: {
    province: "Northern",
    sectors: [
      "Busengo", "Coko", "Cyabingo", "Gakenke", "Gashenyi",
      "Janja", "Kamubuga", "Karambo", "Kivuruga", "Mataba",
      "Minazi", "Mugunga", "Muhondo", "Muyongwe", "Muzo",
      "Nemba", "Ruli", "Rusasa", "Rushashi",
    ],
  },
  Gicumbi: {
    province: "Northern",
    sectors: [
      "Bukure", "Bwisige", "Byumba", "Cyumba", "Giti",
      "Kageyo", "Kaniga", "Manyagiro", "Miyove", "Mukono",
      "Mutete", "Nyamiyaga", "Nyankenke", "Rubaya", "Rukomo",
      "Rushaki", "Rutare", "Ruvune", "Rwamiko", "Shangasha",
    ],
  },
  Musanze: {
    province: "Northern",
    sectors: [
      "Busogo", "Cyuve", "Gacaca", "Gashaki", "Gataraga",
      "Kimonyi", "Kinigi", "Muhoza", "Muko", "Musanze",
      "Nkotsi", "Nyange", "Remera", "Rwaza", "Shingiro",
    ],
  },
  Rulindo: {
    province: "Northern",
    sectors: [
      "Base", "Burega", "Bushoki", "Buyoga", "Cyinzuzi",
      "Cyungo", "Kinihira", "Kisaro", "Masoro", "Mbogo",
      "Murambi", "Ngoma", "Ntarabana", "Rukozo", "Rusiga",
      "Shyorongi", "Tumba",
    ],
  },

  // Southern Province
  Gisagara: {
    province: "Southern",
    sectors: [
      "Gikonko", "Gishubi", "Kansi", "Kibilizi", "Kigembe",
      "Mamba", "Muganza", "Mugombwa", "Mukindo", "Musha",
      "Ndora", "Nyanza", "Save",
    ],
  },
  Huye: {
    province: "Southern",
    sectors: [
      "Gishamvu", "Huye", "Karama", "Kigoma", "Kinazi",
      "Maraba", "Mbazi", "Mukura", "Ngoma", "Ruhashya",
      "Rusatira", "Rwaniro", "Simbi", "Tumba",
    ],
  },
  Kamonyi: {
    province: "Southern",
    sectors: [
      "Gacurabwenge", "Karama", "Karongi", "Kayenzi", "Kayumbu",
      "Mugina", "Musambira", "Ngamba", "Nyamiyaga", "Nyarubaka",
      "Rugarika", "Rukoma", "Runda",
    ],
  },
  Muhanga: {
    province: "Southern",
    sectors: [
      "Cyeza", "Kabacuzi", "Kibangu", "Kiyumba", "Muhanga",
      "Mushishiro", "Nyabinoni", "Nyamabuye", "Nyamiyaga",
      "Rongi", "Rugendabari", "Shyogwe",
    ],
  },
  Nyamagabe: {
    province: "Southern",
    sectors: [
      "Buruhukiro", "Cyanika", "Gasaka", "Gatare", "Kaduha",
      "Kamegeri", "Kibirizi", "Kibumbwe", "Kitabi", "Mbazi",
      "Mugano", "Musange", "Musebeya", "Mushubi", "Nkomane",
      "Tare", "Uwinkingi",
    ],
  },
  Nyanza: {
    province: "Southern",
    sectors: [
      "Busasamana", "Cyabakamyi", "Kibirizi", "Kigoma",
      "Mukingo", "Muyira", "Ntyazo", "Nyagisozi", "Rwabicuma",
    ],
  },
  Nyaruguru: {
    province: "Southern",
    sectors: [
      "Busanze", "Cyahinda", "Kibeho", "Kivu", "Mata",
      "Muganza", "Munini", "Ngera", "Ngoma", "Nyabimata",
      "Nyagisozi", "Ruheru", "Ruramba", "Rusenge",
    ],
  },
  Ruhango: {
    province: "Southern",
    sectors: [
      "Bweramana", "Byimana", "Kabagari", "Kinazi", "Kinihira",
      "Mbuye", "Mwendo", "Ntongwe", "Ruhango",
    ],
  },

  // Western Province
  Karongi: {
    province: "Western",
    sectors: [
      "Bwishyura", "Gashari", "Gishyita", "Gitesi", "Mubuga",
      "Murambi", "Murundi", "Mutuntu", "Rubengera", "Rugabano",
      "Ruganda", "Rwankuba", "Twumba",
    ],
  },
  Ngororero: {
    province: "Western",
    sectors: [
      "Bwira", "Gatumba", "Hindiro", "Kabaya", "Kageyo",
      "Kavumu", "Matyazo", "Muhanda", "Muhororo", "Ndaro",
      "Ngororero", "Nyange", "Sovu",
    ],
  },
  Nyabihu: {
    province: "Western",
    sectors: [
      "Bigogwe", "Jenda", "Jomba", "Kabatwa", "Karago",
      "Kintobo", "Mukamira", "Muringa", "Rambura", "Rugera",
      "Rurembo", "Shyira",
    ],
  },
  Nyamasheke: {
    province: "Western",
    sectors: [
      "Bushekeri", "Bushenge", "Cyato", "Gihombo", "Kagano",
      "Kanjongo", "Karambi", "Karengera", "Kirimbi", "Macuba",
      "Mahembe", "Nyabitekeri", "Rangiro", "Ruharambuga",
      "Shangi",
    ],
  },
  Rubavu: {
    province: "Western",
    sectors: [
      "Bugeshi", "Busasamana", "Cyanzarwe", "Gisenyi", "Kanama",
      "Kanzenze", "Mudende", "Nyamyumba", "Nyundo", "Rubavu",
      "Rugerero",
    ],
  },
  Rusizi: {
    province: "Western",
    sectors: [
      "Bugarama", "Butare", "Bweyeye", "Gashonga", "Giheke",
      "Gihundwe", "Gikundamvura", "Gitambi", "Kamembe",
      "Muganza", "Mururu", "Nkanka", "Nkungu", "Nyakarenzo",
      "Nzahaha", "Rwimbogo",
    ],
  },
  Rutsiro: {
    province: "Western",
    sectors: [
      "Boneza", "Gihango", "Kigeyo", "Kivumu", "Manihira",
      "Mukura", "Murunda", "Musasa", "Mushonyi", "Mushubati",
      "Nyabirasi", "Ruhango", "Rusebeya",
    ],
  },
};

// Sorted district names for the dropdown
export const districtNames = Object.keys(rwandaDistricts).sort();
