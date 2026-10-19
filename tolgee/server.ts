import { getLanguage } from "./language";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE, TolgeeBase } from "./shared";
import { createServerInstance } from "@tolgee/react/server";

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLanguage,
  createTolgee: async (language) => {
    return TolgeeBase().init({
      observerOptions: {
        fullKeyEncode: true,
      },
      language,
      availableLanguages: ALL_LANGUAGES,
      defaultLanguage: DEFAULT_LANGUAGE,
    });
  },
});
