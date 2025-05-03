package edu.ucsb.cs156.example.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * This is a JPA entity that represents a UCSBDate, i.e. an entry
 * that comes from the UCSB API for academic calendar dates.
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "menuitemreviews")
public class MenuItemReview 
{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id; 

  private long itemid; 
  private String revieweremail;
  private int stars;
  private String comments;
  private LocalDateTime datereviewed;  
}