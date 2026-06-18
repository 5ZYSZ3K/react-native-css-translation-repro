import { Text, View } from "react-native";

/**
 * Bug repro: combining translate-x-2 and translate-y-2 results in doubled transforms.
 *
 * Expected: transform: [{translateX: 8}, {translateY: 8}]   → moves 8px right, 8px down
 * Actual:   transform: [{translateX: 8}, {translateY: 8}, {translateX: 8}, {translateY: 8}]
 *             → moves 16px right, 16px down
 *
 * Root cause in react-native-css applyValue():
 *   target.transform = transformArray.filter(t => !(prop in t));
 * When prop === "translate", existing entries are [{translateX: 8}, {translateY: 8}].
 * The filter checks `"translate" in {translateX: 8}` → false, so removes nothing.
 * The second class's parsed [{translateX: 8}, {translateY: 8}] is pushed on top,
 * resulting in 4 entries.
 */
export default function Index() {
  const BOX = "h-8 w-8 absolute";
  const ANCHOR = "top-0 left-0";

  return (
    <View className="flex-1 bg-white p-8 pt-20">
      <Text className="mb-4 text-base font-bold">translate bug repro</Text>

      {/* Row 1: single-axis translates — correct */}
      <View className="mb-12">
        <Text className="mb-2 text-sm text-gray-500">
          Single-axis (correct): gray anchor, green = translate-x-2 (+8px right),
          blue = translate-y-2 (+8px down)
        </Text>
        <View className="relative h-16 w-full border border-gray-200">
          <View className={`${BOX} ${ANCHOR} bg-gray-200`} />
          <View className={`${BOX} ${ANCHOR} translate-x-2 bg-green-500 opacity-70`} />
          <View className={`${BOX} ${ANCHOR} translate-y-2 bg-blue-500 opacity-70`} />
        </View>
      </View>

      {/* Row 2: combined translate — bugged */}
      <View className="mb-12">
        <Text className="mb-2 text-sm text-gray-500">
          Combined (BUG): red box should be at +8px/+8px from gray anchor,
          but is at +16px/+16px due to doubled transforms
        </Text>
        <View className="relative h-24 w-full border border-gray-200">
          <View className={`${BOX} ${ANCHOR} bg-gray-200`} />
          {/* expected position: +8px right, +8px down */}
          <View className={`${BOX} ${ANCHOR} translate-x-2 translate-y-2 bg-red-500 opacity-70`} />
        </View>
      </View>

      {/* Row 3: workaround using style prop */}
      <View>
        <Text className="mb-2 text-sm text-gray-500">
          Workaround (correct): using style prop directly — at +8px/+8px
        </Text>
        <View className="relative h-16 w-full border border-gray-200">
          <View className={`${BOX} ${ANCHOR} bg-gray-200`} />
          <View
            className={`${BOX} ${ANCHOR} bg-purple-500 opacity-70`}
            style={{ transform: [{ translateX: 8 }, { translateY: 8 }] }}
          />
        </View>
      </View>
    </View>
  );
}
