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
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_menuitemreview() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Review").click();

        page.getByText("Create Menu Item Review").click();
        assertThat(page.getByText("Create New Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReview-itemId").fill("1");
        page.getByTestId("MenuItemReview-comments").fill("good");
        page.getByTestId("MenuItemReview-reviewerEmail").fill("7642@ucsb.edu");
        page.getByTestId("MenuItemReview-stars").fill("4");
        page.getByTestId("MenuItemReview-datereviewed").fill("2025-01-01T00:00");

        page.getByTestId("MenuItemReview-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemid"))
                .hasText("1");

        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Menu Item Review")).isVisible();
        page.getByTestId("MenuItemReview-itemId").fill("2");
        page.getByTestId("MenuItemReview-comments").fill("bad");
        page.getByTestId("MenuItemReview-reviewerEmail").fill("7642@ucsb.edu");
        page.getByTestId("MenuItemReview-stars").fill("4");
        page.getByTestId("MenuItemReview-datereviewed").fill("2025-01-01T00:00");

        page.getByTestId("MenuItemReview-submit").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("bad");
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemid")).hasText("2");


        page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemid")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menuitemreview() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Review").click();

        assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemid")).not().isVisible();
    }
}