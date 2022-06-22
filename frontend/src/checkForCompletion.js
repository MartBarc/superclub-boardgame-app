const checkCompletion = () => {
    // We are storing clearedCards as an object since its more efficient 
    //to search in an object instead of an array
    if (Object.keys(clearedCards).length === uniqueCardsArray.length) {
        setShowModal(true);
    }
};