// CreatePostSheet.test.tsx

import React from "react";
import { render } from "@testing-library/react-native";
import CreatePostSheet from "@/app/screens/socialfeed/CreatePostSheet";
import { useSocialFeed } from "@/context/SocialFeedContext";

jest.mock("@/context/SocialFeedContext", () => ({
  useSocialFeed: jest.fn(),
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: React.forwardRef(({ children }, ref) => (
      <View ref={ref}>{children}</View>
    )),
    BottomSheetTextInput: (props: any) => <View {...props} />,
  };
});

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "Icon",
}));

describe("CreatePostSheet", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders the New Post title and buttons", () => {
    (useSocialFeed as jest.Mock).mockReturnValue({
      addPost: jest.fn(),
    });

    const { getByText } = render(<CreatePostSheet />);

    // Check if "New Post" title is rendered
    expect(getByText("New Post")).toBeTruthy();

    // Check if "Cancel" button is rendered
    expect(getByText("Cancel")).toBeTruthy();

    // Check if "Share" button is rendered
    expect(getByText("Share")).toBeTruthy();
  });
});
