import { ContourTestResults, ContourTestAnalysis, ContourTestLoudnessRating } from '../types/ContourTest';

/**
 * Service for handling contour test data processing and analysis
 */
export class ContourTestService {
  
  /**
   * Loudness categories for 7-point scale
   */
  static readonly LOUDNESS_CATEGORIES = [
    'Cannot Hear',           // 0
    'Very Soft',             // 1
    'Soft',                  // 2
    'Comfortable, But Soft', // 3
    'Comfortable',           // 4
    'Comfortable, But Loud', // 5
    'Loud',                  // 6
    'Uncomfortably Loud'     // 7
  ];

  /**
   * Analyzes contour test results and provides insights and recommendations
   */
  static analyzeResults(results: ContourTestResults): ContourTestAnalysis {
    const analysis: ContourTestAnalysis = {
      isNormal: true,
      normalGrowth: true,
      hyperacusis: false,
      recruitment: false,
    };
    
    const recommendations: string[] = [];

    // Sort ratings by intensity
    const sortedRatings = [...results.ratings].sort((a, b) => a.intensity - b.intensity);
    
    // Check for normal growth pattern
    if (sortedRatings.length >= 3) {
      // Check for recruitment (abnormally rapid growth of loudness)
      for (let i = 1; i < sortedRatings.length; i++) {
        const intensityDiff = sortedRatings[i].intensity - sortedRatings[i-1].intensity;
        const ratingDiff = sortedRatings[i].rating - sortedRatings[i-1].rating;
        
        // If loudness rating increases by more than 2 categories with 10dB or less increase
        if (intensityDiff <= 10 && ratingDiff > 2) {
          analysis.normalGrowth = false;
          analysis.recruitment = true;
          analysis.isNormal = false;
          recommendations.push("Consider compression settings in hearing aids to manage loudness recruitment");
          recommendations.push("Counseling about loudness perception may be beneficial");
          break;
        }
      }
    }
    
    // Check for hyperacusis (abnormally low UCL or high ratings at moderate levels)
    if (results.ucl && results.ucl < 85) {
      analysis.hyperacusis = true;
      analysis.isNormal = false;
      recommendations.push("Consider desensitization protocols for loudness tolerance");
      recommendations.push("Careful setting of maximum power output (MPO) in hearing aids");
    }
    
    // Check for abnormally low ratings at high intensities (recruitment)
    const highIntensityRatings = sortedRatings.filter(r => r.intensity >= 70);
    if (highIntensityRatings.length > 0) {
      const averageHighRating = highIntensityRatings.reduce((sum, r) => sum + r.rating, 0) / highIntensityRatings.length;
      
      if (averageHighRating < 5) {
        analysis.isNormal = false;
        recommendations.push("Verify patient's understanding of loudness categories");
        recommendations.push("Consider repeat testing to confirm unusual loudness perception");
      }
    }
    
    // Check MCL and provide recommendations
    if (results.mcl) {
      if (results.mcl < 50) {
        recommendations.push("Consider lower gain settings, especially for high input levels");
      } else if (results.mcl > 75) {
        recommendations.push("Consider higher gain settings to reach comfortable listening levels");
      }
    }
    
    // Generate description of abnormalities
    if (!analysis.isNormal) {
      let description = "";
      
      if (analysis.recruitment) {
        description += "Shows evidence of loudness recruitment (abnormally rapid growth of loudness perception). ";
      }
      
      if (analysis.hyperacusis) {
        description += "Shows signs of hyperacusis (increased sensitivity to normal environmental sounds). ";
      }
      
      if (!analysis.normalGrowth && !analysis.recruitment) {
        description += "Shows abnormal loudness growth pattern. ";
      }
      
      analysis.abnormalitiesDescription = description.trim();
    }
    
    analysis.recommendations = recommendations;
    
    return analysis;
  }
  
  /**
   * Determines Most Comfortable Level (MCL) from contour test results
   */
  static findMCL(ratings: ContourTestLoudnessRating[]): number | undefined {
    // Find ratings with category 4 (Comfortable)
    const comfortableRatings = ratings.filter(r => r.rating === 4);
    
    if (comfortableRatings.length === 0) {
      return undefined;
    }
    
    // If multiple comfortable ratings, take the average
    return Math.round(comfortableRatings.reduce((sum, r) => sum + r.intensity, 0) / comfortableRatings.length);
  }
  
  /**
   * Determines Uncomfortable Level (UCL) from contour test results
   */
  static findUCL(ratings: ContourTestLoudnessRating[]): number | undefined {
    // Find the lowest intensity rated as 7 (Uncomfortably Loud)
    const uncomfortableRatings = ratings.filter(r => r.rating === 7);
    
    if (uncomfortableRatings.length === 0) {
      return undefined;
    }
    
    // Find the lowest intensity rated as uncomfortably loud
    return Math.min(...uncomfortableRatings.map(r => r.intensity));
  }
  
  /**
   * Gets recommendations for hearing aid settings based on contour test
   */
  static getHearingAidRecommendations(results: ContourTestResults): string[] {
    const recommendations: string[] = [];
    
    // If we have MCL and UCL values
    if (results.mcl && results.ucl) {
      const dynamicRange = results.ucl - results.mcl;
      
      if (dynamicRange < 25) {
        recommendations.push("Consider compression with higher ratios (>2:1) to accommodate narrow dynamic range");
        recommendations.push("Set MPO carefully to avoid discomfort");
      } else if (dynamicRange > 40) {
        recommendations.push("Consider compression with lower ratios (1.5:1 or less) to preserve natural loudness perception");
      } else {
        recommendations.push("Standard compression settings may be appropriate (2:1 ratio)");
      }
      
      // Provide frequency-specific recommendations
      switch (results.frequency) {
        case 500:
          recommendations.push("Consider these settings especially for low frequency sounds and channels");
          break;
        case 1000:
          recommendations.push("Consider these settings for mid-frequency speech sounds");
          break;
        case 2000:
        case 4000:
          recommendations.push("Consider these settings especially for high frequency speech sounds");
          break;
      }
    }
    
    // Add general recommendations
    recommendations.push("Verify settings with real-ear measurements");
    recommendations.push("Schedule follow-up to assess comfort with hearing aid settings");
    
    return recommendations;
  }
} 