![votesec logo](https://i.imgur.com/R8rFtyq.png)
#
**Votesec.io** will be a completely automated voting API based on Azure Blockchain that means to serve as a reliable platform for conducting secure online polls/elections.

#demonstration : www.happyhearts.tk

The primary asset of votesec.io is the assurance of complete anonymity. No data concerning the voters is stored in a way that can be traced back to the individual, at any point during the process. This, coupled with the innate security of Azure Blockchain creates a polling environment that ensures the privacy of everyone involved under all possible circumstances. 

Votesec keeps no records of who voted and who didn't, let alone "who voted for who" while still filtering all user input to ensure no one votes more than once and allowing regional voting patterns to be made publicly available.

Also each poll can be configured to use a custom unique identifier, characteristic to each voter. Meaning that Adhaar card numbers would be sufficient for citizens to log in and cast their votes, eliminating the need for voter registration. All Indian citizens above the age of 18 will automatically be recognized as valid voters and enabled to vote, unless specified otherwise by the conducting body.

![anonymous_secure_flexible](https://i.imgur.com/uaXp78A.jpg)

Another major aspect of votesec is the **flexibililty** it offers. Our vision for the final product is for it to be a lightweight API that can be utilized by an entity as small as an organization with populace of less than a hundred people, to the Lok Sabha elections with a voter base of more than 800 million people. All features of the API, let alone the barebones voting and candidate registration mechanism could be made optional, allowing the conducting body to regulate the functionality and Ether cost for the poll.

# Initial product design and overview:

When a user goes in to cast their vote, the adhaar number and other relevant details provided by them are verified from the database of valid voters, which is to be provided by the conducting body. Completing this step outside the smart contract would help minimize ether costs but can be shifted on to the blockchain for more sensitive polls like the nationwide election. After a quick OTP verification via their registered mobile number, their adhaar number is pushed into further processing. 

Here, their identifier(in this case, adhaar) is converted into an irreversible form. Let's call this processed identifier a **muffin** for now.
![conversion](https://i.imgur.com/iX1vva2.png)
Muffins are designed such that they are also valid inputs for the function that handles **votecookie**.

VoteCookie is a state variable of the contract which information about all muffins. Given a muffin, it's possible to verify whether or not it's already contained in the VoteCookie, meaning the same person won't be able to vote twice. This whole process is to be optimized to be faster and less memory consuming than simply using a table of hashed Adhaar numbers.

Further tweaks could include individual votecookies for each candidate, allowing the voters to later verify who their vote went to, via a quick linear search.

#
Summing up, with this framework, we aim to achieve a completely anonymous and automated polling environment, negating any form of rigging accusations, that offers realtime updates and instantenous results, and also enables citizens to vote securely from anywhere, without physical presence at a polling booth.
