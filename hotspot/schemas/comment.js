export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      title: "Approved",
      name: "approved",
      type: "boolean",
      description: "Comments won't show on the site without approval",
    },
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
    },
    {
      name: "name",
      type: "string",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "comment",
      type: "text",
    },
  ],
};
