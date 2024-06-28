import prcs from "process";
import path from "path";

export const getResourcePath = (resourceName: string): string => {
  let resourcePath = null;
  if (process.env.NODE_ENV === "development") {
    resourcePath = path.join(
      __dirname,
      "..",
      "..",
      "resources",
      path.normalize(resourceName)
    );
  } else {
    resourcePath = path.join(
      prcs.resourcesPath,
      "resources",
      path.normalize(resourceName)
    );
  }
  return resourcePath;
};
