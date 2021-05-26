## Content

Please describe your contribution here...

---

## Checklist

Please check that your pull request is correct:

- Each commit:
    - [ ] corresponds to a contribution that should be notified to users,
    - [ ] does not generate new errors or warnings at compile or test time,
    - [ ] must be attributed to its real authors (with correct GitHub IDs and [correct syntax for multiple authors](https://help.github.com/articles/creating-a-commit-with-multiple-authors/)).
- The title of a commit should:
    - [ ] begin with a contribution type
        - `FEATURE` for a behaviour allowing a user to do something new,
        - `FIX` for a behaviour which has been changed in order to meet user’s expectations,
        - `SCENARIO` for examples showing a given behaviour,
        - `TEST` when it concerns an acceptance test of a given behaviour,
        - `PROCESS` for a change in the way the software is built, tested, deployed,
        - `DOC` when it concerns only internal documentation (however it is better to combine it with the contribution that required this documentation change),
    - [ ] be followed by a colon (`:`) with one space after and no space before,
    - [ ] be followed by a title (written in English) as short, as user-centered and as explicit as possible
        - If it is a feature, the title must be the user action (beginning with a verb, and please not `manage`),
        - If it is a fix, the title must describe the intended behavior (with `should`).
    - [ ] ends with a reference to the corresponding ticket with the following syntax:
        - `(closes #xx)` if xx is a feature ticket (and the commit is a complete implementation),
        - `(fixes #xx)` if xx is a fix ticket (and the commit is a complete fix),
        - `(see #xx)` otherwise,
- Each committed line is:
    - [ ] useful (it would not work if removed)
        - if it is a comment line, its information could not be conveyed by better variables and function naming, better code structuring, or better commit message,
    - [ ] related to this very contribution (feature, fix...),
    - [ ] in English (with the exception of Gherkin scenarios in French and resulting steps),
    - [ ] without any typo in variable, class or function names,
    - [ ] correctly indented (spaces rather than tabs, same number of characters as in the rest of the file).
