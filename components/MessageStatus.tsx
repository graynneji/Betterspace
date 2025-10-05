import { Ionicons } from "@expo/vector-icons";
import React from "react";

const MessageStatusIcon = ({ status }: { status?: 'sending' | 'sent' | 'delivered' | 'read' }) => {
    if (!status || status === 'sending') {
        return (
            <Ionicons
                name="time-outline"
                size={14}
                color="rgba(255, 255, 255, 0.7)"
                style={{ marginLeft: 4 }}
            />
        );
    }

    if (status === 'sent') {
        return (
            <Ionicons
                name="checkmark"
                size={14}
                color="rgba(255, 255, 255, 0.7)"
                style={{ marginLeft: 4 }}
            />
        );
    }

    if (status === 'delivered' || status === 'read') {
        return (
            <Ionicons
                name="checkmark-done"
                size={14}
                color='#000000'
                // color={status === 'read' ? "#4CAF50" : "rgba(255, 255, 255, 0.7)"}
                style={{ marginLeft: 4, alignSelf: 'flex-end' }}
            />
        );
    }

    if (status === 'failed') {
        return (
            <Ionicons
                name="alert-circle-outline"
                size={14}
                color="#f44336"
                style={{ marginLeft: 4 }}
            />
        );
    }

    return null;
};

export default MessageStatusIcon;