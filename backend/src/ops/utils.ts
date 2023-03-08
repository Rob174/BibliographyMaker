import request from "request-promise";
import uuid from "uuid";
import seedrandom from "seedrandom";
export const getBibtex = async (doi) => {
  // console.log("getBibtex");
  const url = `https://api.crossref.org/works/${doi}`;
  // console.log(url);
  const options = {
    uri: url,
    json: true,
  };
  try {
    const bibtex = await request(options);
    return bibtex.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export function formatTrim(str) {
  str = sanitizeTitle(str);

  const limit = 50;
  if (str.length > limit) {
    str = str.substring(0, limit) + "...";
  }
  return str;
}
export function sanitizeTitle(str: string) {
  try {
    str = str.replace(/\\n/g, " ");
  } catch (err) {
    console.log(
      "Error1 in sanitizeTitle for string: ",
      str,
      " with type ",
      typeof str
    );
    console.log(err);
    throw err;
  }
  try {
    str = str.replace(/\s+/g, " ");
  } catch (err) {
    console.log("Error2 in sanitizeTitle for string: " + str);
    console.log(err);
    throw err;
  }
  try {
    str = str.replace(/\|/g, " ");
  } catch (err) {
    console.log("Error3 in sanitizeTitle for string: " + str);
    console.log(err);
    throw err;
  }
  try {
    // Remove html tags
    str = str.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, "");
  } catch (err) {
    console.log("Error4 in sanitizeTitle for string: " + str);
    console.log(err);
    throw err;
  }
  return str;
}

export const deterministicUuid = () => {
  const seed = "my_seed"; // Set a fixed seed
  const rng = seedrandom(seed); // Initialize the pseudo-random number generator with the seed

  const uuidv4 = () => {
    // Define a function to generate UUIDs
    return (
      "a" +
      uuid
        .v4({
          random: [...new Array(16)].map(() => Math.floor(rng() * 256)), // Use the pseudo-random number generator to generate random bytes for the UUID
        })
        .replace(/-/g, "")
    );
  };
  return uuidv4;
};
export const formatUUID = (uuid) => {
  return uuid.replace(/-/g, "");
};
