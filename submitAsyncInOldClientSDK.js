

import { connectNetwork } from "../fabric/gateway.js";
import { DefaultEventHandlerStrategies } from 'fabric-network';

async function invoke(orgName, user, funcName, param) {
    // Connect with event strategy that doesn't wait for commitment
    const { gateway, contract } = await connectNetwork(orgName, user, {
        eventHandlerOptions: {
            strategy: DefaultEventHandlerStrategies.NONE
        }
    });

    try {
        if (funcName === "addFolder") {
            // Parameter validation (same as previous optimized version)
            const requiredParams = { /* ... */ };
            
            // Create transaction and get ID early
            const transaction = contract.createTransaction(funcName);
            const transactionId = transaction.getTransactionId();

            try {
                await transaction.evaluate(
                    param.creatorId,
                    param.folderId,
                    param.folderName,
                    param.parentFolderId,
                    param.createdAt,
                    param.lastModified
                );
            } catch (evaluateError) {
                throw new Error(`Endorsement failed: ${evaluateError.message}`);
            }

            transaction.submit(
                param.creatorId,
                param.folderId,
                param.folderName,
                param.parentFolderId,
                param.createdAt,
                param.lastModified
            )
            // .catch(submitError => {
            //     console.error('Background submission error:', submitError);
            // });

            return {
                transactionId: transactionId,
                message: "Transaction endorsed successfully, commitment in progress"
            };
        }
    } finally {
        gateway.disconnect();
    }
}

export { invoke };
