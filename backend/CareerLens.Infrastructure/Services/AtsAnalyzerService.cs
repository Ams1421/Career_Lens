using System.Text.Json;
using System.Text.RegularExpressions;

namespace CareerLens.Infrastructure.Services;

// New result model for Step 2
public record AtsResult(
    int Score,
    int KeywordMatch,
    string Suggestions,
    string MissingSkills,
    string SectionScores);

public class AtsAnalyzerService
{
    private static readonly string[] TechSkills =
    {
        ".net","c#","react","javascript","typescript",
        "sql","postgresql","azure","docker","git",
        "html","css","python","java","power bi","excel"
    };

    private static readonly string[] ActionVerbs =
    {
        "built","developed","implemented","designed",
        "created","optimized","improved","reduced",
        "increased","managed","led","delivered"
    };

    public AtsResult Analyze(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return new AtsResult(
                Score: 10,
                KeywordMatch: 0,
                Suggestions: "Resume text could not be extracted.",
                MissingSkills: string.Join(", ", TechSkills.Take(8)),
                SectionScores: JsonSerializer.Serialize(new Dictionary<string, int>
                {
                    ["Skills"] = 0,
                    ["Projects"] = 0,
                    ["Education"] = 0,
                    ["Formatting"] = 50
                }));
        }

        text = text.ToLower();

        int score = 0;
        var tips = new List<string>();

        bool Has(params string[] words) =>
            words.Any(w => text.Contains(w));

        // ----------------------------
        // Contact (10)
        // ----------------------------

        bool hasEmail = Regex.IsMatch(text, @"\b[\w._%+-]+@[\w.-]+\.\w+\b");

        if (hasEmail)
            score += 5;
        else
            tips.Add("Add an email address.");

        bool hasPhone = Regex.IsMatch(text, @"\b\d{10}\b");

        if (hasPhone)
            score += 5;
        else
            tips.Add("Add a phone number.");

        // ----------------------------
        // Summary (10)
        // ----------------------------

        bool hasSummary = Has("summary", "professional summary", "profile");

        if (hasSummary)
            score += 10;
        else
            tips.Add("Add a Professional Summary section.");

        // ----------------------------
        // Skills (20)
        // ----------------------------

        int matchedSkills = TechSkills.Count(text.Contains);

        if (Has("skills"))
        {
            score += 8;
            score += Math.Min(12, matchedSkills);
        }
        else
        {
            tips.Add("Add a Skills section.");
        }

        // ----------------------------
        // Experience (20)
        // ----------------------------

        bool hasExperience = Has("experience", "work experience");

        if (hasExperience)
            score += 20;
        else
            tips.Add("Add a Work Experience section.");

        // ----------------------------
        // Education (15)
        // ----------------------------

        bool hasEducation = Has("education");

        if (hasEducation)
            score += 15;
        else
            tips.Add("Add an Education section.");

        // ----------------------------
        // Projects (10)
        // ----------------------------

        bool hasProjects = Has("project", "projects");

        if (hasProjects)
            score += 10;
        else
            tips.Add("Add a Projects section.");

        // ----------------------------
        // Action Verbs (5)
        // ----------------------------

        int verbs = ActionVerbs.Count(text.Contains);

        score += Math.Min(5, verbs);

        if (verbs < 3)
            tips.Add("Use stronger action verbs like Built, Designed, Implemented.");

        // ----------------------------
        // Quantified Achievements (10)
        // ----------------------------

        int numbers = Regex.Matches(
            text,
            @"\d+%|\d+\+|\d+\s*(years|months)").Count;

        score += Math.Min(10, numbers * 2);

        if (numbers < 3)
            tips.Add("Include measurable achievements (e.g. 30% improvement, 2 years).");

        // ----------------------------
        // ATS Formatting (10)
        // ----------------------------

        score += 10;

        score = Math.Min(100, score);

        // ============================
        // New Step 2 Features
        // ============================

        int keywordMatch = (int)Math.Round(
            matchedSkills * 100.0 / TechSkills.Length);

        var missingSkills = TechSkills
            .Where(skill => !text.Contains(skill))
            .Take(8)
            .ToList();

        var sectionScores = new Dictionary<string, int>
        {
            ["Contact"] = (hasEmail && hasPhone) ? 100 : 50,
            ["Summary"] = hasSummary ? 100 : 40,
            ["Skills"] = Math.Min(keywordMatch, 100),
            ["Experience"] = hasExperience ? 100 : 40,
            ["Education"] = hasEducation ? 100 : 50,
            ["Projects"] = hasProjects ? 100 : 40,
            ["Formatting"] = 100
        };

        return new AtsResult(
            Score: score,
            KeywordMatch: keywordMatch,
            Suggestions: string.Join(" ", tips.Distinct()),
            MissingSkills: string.Join(", ", missingSkills),
            SectionScores: JsonSerializer.Serialize(sectionScores));
    }
}