import withPwa from "next-pwa";

export default withPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})({ output: "standalone" });
