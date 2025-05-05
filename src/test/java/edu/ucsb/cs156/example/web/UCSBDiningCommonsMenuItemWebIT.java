package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItem;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Test
    public void admin_user_can_create_edit_delete_ucsbDiningCommonsMenuItem() throws Exception {

        UCSBDiningCommonsMenuItem ucsbDiningCommonsMenuItem = UCSBDiningCommonsMenuItem.builder()
                .diningCommonsCode("Ortega")
                .name("Carnitas burrito")
                .station("Entree")
                .build();
                
        ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonsMenuItem);

        setupUser(true);

        page.getByText("UCSB Dining Commons Menu Items").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
                .hasText("Carnitas burrito");

        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBDiningCommonsMenuItem")).isVisible();
        page.getByLabel("DiningCommonsCode").fill("Ortega");
        page.getByLabel("Name").fill("Steak burrito");
        page.getByLabel("Station").fill("Special Entree");
        page.getByText("Update").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name")).hasText("Steak burrito");

        page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsbDiningCommonsMenuItem() throws Exception {
        setupUser(false);

        page.getByText("UCSB Dining Commons Menu Items").click();

        assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void admin_can_create_ucsbDiningCommonsMenuItem() throws Exception {
        setupUser(true);

        page.getByText("UCSB Dining Commons Menu Items").click();

        assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).isVisible();
    }
}