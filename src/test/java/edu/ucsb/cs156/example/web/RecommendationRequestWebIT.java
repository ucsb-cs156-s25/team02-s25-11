package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
        setupUser(true);

        page.getByText("Recommendation Request").click();

        page.getByText("Create RecommendationRequest").click();
        assertThat(page.getByText("Create New RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("wsong@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("user3@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("this is a request");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2022-02-02T00:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2022-02-03T00:00");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("this is a request");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
        page.getByTestId("RecommendationRequestForm-explanation").fill("this is another request");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).hasText("this is another request");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_recommendationrequest() throws Exception {
        setupUser(false);

        page.getByText("Recommendation Request").click();

        assertThat(page.getByText("Create RecommendationRequestForm")).not().isVisible();
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).not().isVisible();
    }
}
