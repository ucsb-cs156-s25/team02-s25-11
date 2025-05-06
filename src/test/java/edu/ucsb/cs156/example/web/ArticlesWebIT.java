package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticlesWebIT extends WebTestCase {

    @Autowired
        ArticlesRepository articlesRepository;

    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {

        LocalDateTime ldt1 = LocalDateTime.parse("2025-04-21T17:00:00");

        String title1 = "firstArticles";
        
        Articles article1 = Articles.builder()
                .title(title1)
                .url("https://github.com/ucsb-cs156-s25/team01-s25-11/commit/8e28ad3216e5156bb0ffbd67164f761635920f41")
                .explanation("sl-updated")
                .email("shuang_li@ucsb.edu")
                .dateAdded(ldt1)
                .build();

        articlesRepository.save(article1);
        
        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText(title1);

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
    }

    @Test
    public void regular_user_can_see_create_article_button() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).isVisible();
    }
}