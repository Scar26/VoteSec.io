![votesec logo](https://i.imgur.com/R8rFtyq.png)
#
<b>Votesec.io</b> will be a completely automated voting API based on Azure Blockchain that means to serve as a realiable platform for conducting secure online polls/elections.

The primary asset of votesec.io is the assurance of complete anonymity. No data concerning the voters is stored in a way that can be traced back to the individual, at any point during the process. This, coupled with the innate security of Azure Blockchain creates a polling environment that ensures the privacy of everyone involved under all possible circumstances. 

Votesec keeps no records of who voted and who didn't, let alone "who voted for who" while still filtering all user input to ensure no one votes more than once and allowing regional voting patterns to be made publicly available.

Also each poll can be configured to use a custom unique identifier, characteristic to each voter. Meaning that Adhaar card numbers would be sufficient for citizens to log in and cast their votes, eliminating the need for voter registration. All Indian citizens above the age of 18 will automatically be recognized as valid voters and enabled to vote, unless specified otherwise by the conducting body.

![anonymous_secure_flexible](https://i.imgur.com/uaXp78A.jpg)

Another major aspect of votesec is the <b>flexibililty</b> it offers. Our vision for the final product is for it to be a lightweight API that can be utilized by an entity as small as an organization with populace of less than a hundred people, to the Lok Sabha elections with a voter base of more than 800 million people. All features of the api, let alone the barebones voting and candidate registration mechanism could be made optional, allowing the conducting body a great deal of control over the balance between functionality and the Ether cost for the poll.

# Initial product design and overview:

When a user goes in to cast their vote, the adhaar number and other relevant details provided by them are verified from the database of valid voters, which is to be provided by the conducting body. Completing this step outside the smart contract would help minimize ether costs but can be shifted on to the blockchain for more sensitive polls like the nationwide election. After a quick OTP verification via their registered mobile number, their adhaar number is pushed into further processing. 

Here, their identifier(in this case, adhaar) is converted into a form from which it's impossible to retrieve the original number. Let's call this processed identifier a <b>muffin</b> for now.
![conversion](https://i.imgur.com/iX1vva2.png)
Muffins are designed such that they are also valid inputs for the function that handles <b>votecookie</b>.

VoteCookie is a state variable of the contract. VoteCookie holds holds information about all muffins. Given a random muffin, it's possible to verify whether or not it's already contained in the VoteCookie, meaning the same person won't be able to vote twice. This whole process is to be optimized to be faster and less memory consuming than simply using a table of hashed adhaar numbers.

Further tweaks could include individual votecookies for each candidate, allowing the voters to later verify who their vote went to, via a quick linear search.

#
Summing up, with this framework, we aim to achieve :

a) A completely anonymous and automated polling environment, negating any form of rigging accusations.

b) Realtime updates. Each vote that is cast is processed immediately, enabling realtime updates on the election and instantaneous results as soon as polling concludes.

c) A secure online voting platform that allows citizens to vote from anywhere, without physics presence at a polling booth
