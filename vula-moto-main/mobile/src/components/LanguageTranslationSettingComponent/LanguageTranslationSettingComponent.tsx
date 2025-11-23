import { View } from "react-native";
import React from "react";
import { useSettingsStore } from "@/src/store/settingsStore";
import DropdownSelect from "react-native-input-select";
import { COLORS, FONTS, LANGUAGE_OPTIONS } from "@/src/constants";
import { onImpact } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";

const LanguageTranslationSettingComponent = () => {
  const [lang, setLang] = React.useState("en");
  const { settings, update } = useSettingsStore();

  React.useEffect(() => {
    setLang(settings.lang);
  }, [settings]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 2,
      }}
    >
      <Ionicons name={"language"} size={24} color={COLORS.black} />
      <View style={{ flex: 1, marginBottom: -10 }}>
        <DropdownSelect
          placeholder="Default Language"
          options={LANGUAGE_OPTIONS}
          optionLabel={"name"}
          optionValue={"value"}
          selectedValue={lang}
          isMultiple={false}
          dropdownIconStyle={{ top: 15, right: 15 }}
          modalControls={{
            modalOptionsContainerStyle: {
              backgroundColor: COLORS.white,
            },
          }}
          dropdownStyle={{
            borderWidth: 0,
            paddingVertical: 8,
            paddingHorizontal: 20,
            minHeight: 40,
            backgroundColor: COLORS.main,
            flexDirection: "column-reverse",
          }}
          placeholderStyle={{
            color: COLORS.black,
            fontSize: 16,
            fontFamily: FONTS.regular,
          }}
          onValueChange={async (value: any) => {
            if (settings.haptics) await onImpact();
            update({ ...settings, lang: value });
          }}
          primaryColor={COLORS.secondary}
          dropdownHelperTextStyle={{
            display: "none",
          }}
          selectedItemStyle={{
            color: COLORS.black,
            fontSize: 14,
            fontFamily: FONTS.bold,
          }}
          listComponentStyles={{
            itemSeparatorStyle: { borderColor: COLORS.gray },
          }}
          checkboxControls={{
            checkboxLabelStyle: {
              fontFamily: FONTS.bold,
              color: COLORS.black,
              fontSize: 16,
            },
            checkboxStyle: {
              borderRadius: 999,
              borderColor: COLORS.transparent,
            },
          }}
        />
      </View>
    </View>
  );
};
export default LanguageTranslationSettingComponent;
