export const uid = () => crypto.randomUUID();
export const today = () => new Date().toISOString().slice(0, 10);
export const scenarios: Record<
  string,
  { issue: string; symptoms: string; steps: string }
> = {
  "Leaf discoloration": {
    issue: "Possible nutrient or moisture stress",
    symptoms:
      "Yellowing leaves and uneven coloration in this demonstration scenario.",
    steps:
      "Record the pattern across the field, check soil moisture, and ask an extension officer to inspect the crop before taking action.",
  },
  "Leaf spots": {
    issue: "Possible leaf disease symptoms",
    symptoms: "Brown leaf spots in this preconfigured demonstration.",
    steps:
      "Photograph affected and healthy leaves, avoid moving affected plant material between fields, and arrange an extension officer review.",
  },
  "Healthy appearance": {
    issue: "No visible concern in this demo scenario",
    symptoms:
      "Uniform foliage in the selected example. This does not establish crop health.",
    steps:
      "Continue routine observation and consult an extension officer if the crop changes.",
  },
};
