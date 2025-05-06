import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// toast mock
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

// Navigate mock
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const queryClient = new QueryClient();

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("Renders expected content and submits form", async () => {
    setupUserOnly();

    const article = {
      id: 1,
      title: "add table",
      url: "https://github.com/ucsb-cs156-s25/team02-s25-11/commit/525f9901430a9c435377f833b166147fa6c04e61",
      explanation: "add UCSBDiningCommonsMenuItemTable, tests, and stories",
      email: "saul_diaz@ucsb.edu",
      dateAdded: "2025-05-01T02:22:14.637",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: article.title },
    });
    fireEvent.change(screen.getByLabelText("Url"), {
      target: { value: article.url },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: article.explanation },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: article.email },
    });
    fireEvent.change(screen.getByLabelText("DateAdded (iso format)"), {
      target: { value: article.dateAdded },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].params).toEqual({
      title: article.title,
      url: article.url,
      explanation: article.explanation,
      email: article.email,
      dateAdded: article.dateAdded,
    });

    expect(mockToast).toHaveBeenCalledWith(
      `New articles Created - id: ${article.id} title: ${article.title}`,
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" });
  });
});
