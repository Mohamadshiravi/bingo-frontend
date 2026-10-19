import { Tolgee, FormatSimple } from "@tolgee/web";
import faIR from "../i18n/fa-IR.json";
import enUS from "../i18n/en-US.json";

export const ALL_LANGUAGES = ["en-US", "fa-IR"];

export const DEFAULT_LANGUAGE = "fa-IR";

export function TolgeeBase() {
  return Tolgee()
    .use(FormatSimple())
    .updateDefaults({
      // Bundled translations only: no remote backend or editor plugins.
      staticData: {
        "fa-IR": faIR,
        "en-US": enUS,
      },
      defaultLanguage: DEFAULT_LANGUAGE,
      availableLanguages: ALL_LANGUAGES,
    });
}
