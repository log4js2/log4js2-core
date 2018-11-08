# Contributing to log4js2

Thanks for choosing log4js2 as your choice of logger. We would love for you to contribute to log4js2 and help make it 
better. As a contributor, here are the guidelines we would like you to follow:

 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)

## <a name="question"></a> Got a Question or Problem?

There are several ways how you can ask your question:

* You can create a question on [StackOverflow](https://stackoverflow.com/questions/tagged/log4js2) where the questions should be tagged with tag `log4js2`.
* You can create issue on [github](https://github.com/anigenero/log4js2/issues)

## <a name="issue"></a> Found a Bug?

If you find a bug in the source code, you can help us by [submitting an issue](#submit-issue) to our 
[GitHub Repository](https://github.com/anigenero/log4js2), or you can [submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

You can _request_ a new feature by [submitting an issue](#submit-issue) to the GitHub Repository. If you would like to 
_implement_ a new feature, please submit an issue with a proposal for your work first, to be sure that it can be used.
Please consider what kind of change it is:

- For a __Major Feature__, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
- __Small Features__ can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker to see if an issue for your problem already exists. The 
discussion might inform you of solutions, workarounds, or future releases.

Before fixing a bug, we need to reproduce and confirm it. In order to reproduce bugs we ask you to provide a code 
snippet that shows a reproduction of the problem. 

You can file new issues by filling out our [new issue form](https://github.com/anigenero/log4js2/issues/new).

### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

- Search [GitHub](https://github.com/anigenero/log4js2/pulls) for an open or closed PR that relates to your submission to 
prevent duplicate submission.
- Make your changes in a new git branch:
     ```shell
     git checkout -b fix-branch master
     ```
     
- Create your patch, including appropriate test cases. __Without tests your PR will not be accepted__.
- Run the full test suite and ensure that all tests pass.
    ```shell
     npm test
     ```
     
- Commit your changes using a descriptive commit message
     ```shell
     git commit -a
     ```
     
- Push your branch to GitHub:

    ```shell
    git push origin fix-branch
    ```

- In GitHub, send a pull request to `log4js2:master`.
- If we suggest changes then:
  * Make the required updates.
  * Re-run the log4js2 test suites to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete fix-branch
    ```

- Check out the master branch:

    ```shell
    git checkout master -f
    ```

- Delete the local branch:

    ```shell
    git branch -D fix-branch
    ```

- Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master
    ```

## Financial contributions

If you would like to contribute (aka buy me a beer), you can send funds via PayPal at the link below.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SLT7SZ2XFNEUQ)