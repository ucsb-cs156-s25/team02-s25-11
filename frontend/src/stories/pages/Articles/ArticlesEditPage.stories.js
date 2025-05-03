import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";
import { articlesFixtures } from "fixtures/articlesFixtures";

export default {
  title: "pages/Articles/ArticlesEditPage",
  component: ArticlesEditPage,
};

const Template = () => <ArticlesEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles", () => {
      return HttpResponse.json(articlesFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/articles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/articles", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json(
        {
          id: 17,
          title: "edit table",
          url: "https://github.com/ucsb-cs156-s25/team02-s25-11",
          explanation: "edit page",
          email: "shuang_li@ucsb.edu",
          dateAdded: "2025-05-02T09:11:14",
        },
        { status: 200 },
      );
    }),
  ],
};
