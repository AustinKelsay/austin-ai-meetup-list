import { COMMUNITY_SLOT_LABEL } from "../../app/constants.js";

export const submissionScreens = {
  link: {
    kind: "link",
    eyebrow: "Submit a link",
    title: "Add a meetup link",
    description: "A link is simply a link you are submitting that you want to be talked about generally.",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Short label for the link",
        required: true,
      },
      {
        name: "urls",
        label: "Links",
        type: "textarea",
        placeholder: "https://example.com\nhttps://example.com/another-link",
        required: true,
        rows: 4,
      },
    ],
  },
  showcase: {
    kind: "showcase",
    eyebrow: COMMUNITY_SLOT_LABEL,
    title: "Propose a showcase",
    description: "A showcase is something you want to showcase or talk about for three to five minutes at the meetup.",
    fields: [
      {
        name: "title",
        label: "Topic title",
        type: "text",
        placeholder: "What you want to talk about",
        required: true,
      },
      {
        name: "description",
        label: "What you want to cover",
        type: "textarea",
        placeholder: "What do you want to showcase or talk about for three to five minutes?",
        required: true,
        rows: 6,
      },
    ],
  },
};
