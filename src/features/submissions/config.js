import { COMMUNITY_SLOT_LABEL } from "../../app/constants.js";

export const submissionScreens = {
  link: {
    kind: "link",
    eyebrow: "Submit a link",
    title: "Add a meetup link",
    description: "Share a link for the next meetup.",
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
    description: "Propose a 3-5 minute demo, build, or discussion.",
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
        placeholder: "What do you want to demo or discuss?",
        required: true,
        rows: 6,
      },
    ],
  },
};
