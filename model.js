
export async function trainModel(model) {
    // The model is already trained, so this is a no-op.
    return Promise.resolve(null);
}

export async function initModel({
    threshold = 0.8,
    toxicityLabels = ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene']
}) {
    return toxicity.load(threshold, toxicityLabels).then(classifier => {
        return {
            predict: (input) => {
                return classifier.classify(input);
            }
        };
    });
}
