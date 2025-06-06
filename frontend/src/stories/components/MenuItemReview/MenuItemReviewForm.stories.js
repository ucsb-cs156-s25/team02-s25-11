import React from "react";
import RestaurantForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";

export default {
  title: "components/MenuItemReview/MenuItemReviewForm",
  component: MenuItemReviewForm,
};

const Template = (args) => {
  return <RestaurantForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: menuItemReviewFixtures.oneMenuItemReview,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
