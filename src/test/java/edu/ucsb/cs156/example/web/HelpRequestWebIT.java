package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import java.time.LocalDateTime;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {

    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Test
    public void admin_user_can_create_edit_delete_helprequests() throws Exception {

        LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

        HelpRequest helpRequest = HelpRequest.builder()
                        .requesterEmail("user1@ucsb.edu")
                        .teamId("11")
                        .tableOrBreakoutRoom("Table")
                        .requestTime(ldt)
                        .explanation("Test1")
                        .solved(false)
                        .build();
                                
                helpRequestRepository.save(helpRequest);
        setupUser(true);

        page.getByText("Help Requests").click();


        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
                .hasText("user1@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit HelpRequest")).isVisible();
        page.getByLabel("Requester Email").fill("user2@ucsb.edu");
        page.getByLabel("Team ID").fill("7");
        page.getByLabel("Table/Breakout Room").fill("Table");
        page.getByLabel("Explanation").fill("New Test");
        page.getByLabel("Solved").check();
        page.getByText("Update").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).hasText("user2@ucsb.edu");

        page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();

    }

    @Test
    public void regular_user_cannot_create_helpRequest() throws Exception {
        setupUser(false);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create HelpRequest")).not().isVisible();
        assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

    @Test
    public void admin_can_create_helpRequest() throws Exception {
        setupUser(true);

        page.getByText("Help Requests").click();

        assertThat(page.getByText("Create HelpRequest")).isVisible();
    }
}