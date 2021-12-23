MODELS

Record:
Id :
Type : i(child),c(corona),f(files)
VaccineName : ['polio','verocell'...]
image : url
PersonId
userId (expertId updatedBy)
Place

Person
id
name
address
image
majorId:['citizenship','janmadartaNo']

User
id
role : [expert, user]
username
password
PersonId : PersonId
children :[majorId]

Question

id
title
desc
upVote
downVote
comments : [commentId]

Comment
id
comment
upVote
downVote
questionId
isApproved
