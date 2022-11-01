import YumError from "../error/YumError";

const error = () => { throw new YumError(1020); } // TODO Review code

export const promises = {
    mkdir: error,
    readFile: error,
    writeFile: error
};
