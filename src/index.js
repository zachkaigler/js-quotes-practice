// Stable elements
let quoteListUL = document.querySelector("ul#quote-list")
let submitForm = document.querySelector("form#new-quote-form")
let likesDomArray = []


// Populate quotes from server to DOM
fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(function(quotesArray) {
        quotesArray.forEach(function(quoteObj) {
            let quoteLi = document.createElement("li")
                quoteLi.classList = "quote-card"
            let quoteBlockquote = document.createElement("blockquote")
                quoteBlockquote.classList = "blockquote"
            let quoteP = document.createElement("p")
                quoteP.classList = "mb-0"
                quoteP.innerText = quoteObj.quote
            let quoteAuthorFooter = document.createElement("footer")
                quoteAuthorFooter.innerText = quoteObj.author
            let lineBreak = document.createElement("br")
            let likeButton = document.createElement("button")
                likeButton.classList = "btn-success"
                likeButton.innerText = `Likes: `
            let likeNumberSpan = document.createElement("span")
                likeNumberSpan.innerText = quoteObj.likes.length
            let deleteButton = document.createElement("button")
                deleteButton.classList = "btn-danger"
                deleteButton.innerText = "Delete"

            likeButton.append(likeNumberSpan)
            quoteBlockquote.append(quoteP, quoteAuthorFooter, lineBreak, likeButton, deleteButton)
            quoteLi.append(quoteBlockquote)
            quoteListUL.append(quoteLi)

            // Like button functionality
            likeButton.addEventListener("click", function(event) {
                fetch("http://localhost:3000/likes", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        quoteId: quoteObj.id
                    })
                })
                    .then (resp => resp.json())
                    .then (function(newLikeObj) {
                        fetch("http://localhost:3000/quotes?_embed=likes")
                            .then(resp => resp.json())
                            .then(function(quotesArray) {
                                likeNumberSpan.innerText = quotesArray[quoteObj.id - 1].likes.length
                            })
                    })
            })

            // Delete button functionality
            deleteButton.addEventListener("click", function(event) {
                fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                    method: "DELETE"
                })
                    .then(resp => resp.json())
                    .then(function(emptyObj) {
                        quoteLi.remove()
                    })
            })
        })
    }) 

// Form functionality
submitForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let userInputNewQuote = event.target.quote.value
    let userInputAuthor = event.target.author.value

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            quote: userInputNewQuote,
            author: userInputAuthor
        })
    })
        .then(resp => resp.json())
        .then(function(newQuoteObj) {
            let quoteLi = document.createElement("li")
                quoteLi.classList = "quote-card"
            let quoteBlockquote = document.createElement("blockquote")
                quoteBlockquote.classList = "blockquote"
            let quoteP = document.createElement("p")
                quoteP.classList = "mb-0"
                quoteP.innerText = newQuoteObj.quote
            let quoteAuthorFooter = document.createElement("footer")
                quoteAuthorFooter.innerText = newQuoteObj.author
            let lineBreak = document.createElement("br")
            let likeButton = document.createElement("button")
                likeButton.classList = "btn-success"
                likeButton.innerText = `Likes: `
            let likeNumberSpan = document.createElement("span")
                likeNumberSpan.innerText = 0
            let deleteButton = document.createElement("button")
                deleteButton.classList = "btn-danger"
                deleteButton.innerText = "Delete"

            likeButton.append(likeNumberSpan)
            quoteBlockquote.append(quoteP, quoteAuthorFooter, lineBreak, likeButton, deleteButton)
            quoteLi.append(quoteBlockquote)
            quoteListUL.append(quoteLi)

            // Like button functionality
            likeButton.addEventListener("click", function(event) {
                fetch("http://localhost:3000/likes", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        quoteId: newQuoteObj.id
                    })
                })
                    .then (resp => resp.json())
                    .then (function(newLikeArray) {
                        fetch("http://localhost:3000/quotes?_embed=likes")
                            .then(resp => resp.json())
                            .then(function(quotesArray) {
                                likeNumberSpan.innerText = quotesArray[newQuoteObj.id - 1].likes.length
                            })
                    })
            })

            // Delete button functionality
            deleteButton.addEventListener("click", function(event) {
                fetch(`http://localhost:3000/quotes/${newQuoteObj.id}`, {
                    method: "DELETE"
                })
                    .then(resp => resp.json())
                    .then(function(emptyObj) {
                        quoteLi.remove()
                    })
            })
        })
})