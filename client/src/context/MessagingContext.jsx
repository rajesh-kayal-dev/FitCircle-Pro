import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
  CURRENT_USER_ID,
  mockConversations,
  mockMessages,
  mockGroups,
  mockGroupMessages,
  mockContacts,
  CURRENT_USER,
} from "../api/mockMessages";

const MessagingContext = createContext(null);

const initialState = {
  conversations: mockConversations,
  messages: mockMessages,
  groups: mockGroups,
  groupMessages: mockGroupMessages,
  contacts: mockContacts,
};

function messagingReducer(state, action) {
  switch (action.type) {
    case "SEND_MESSAGE": {
      const { conversationId, text } = action;
      const newMsg = {
        id: `msg_${Date.now()}`,
        senderId: CURRENT_USER_ID,
        text,
        timestamp: new Date(),
        type: "text",
      };
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMsg],
      };
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { text, timestamp: new Date(), isFromMe: true }, unreadCount: 0 }
          : c
      );
      return { ...state, messages: updatedMessages, conversations: updatedConversations };
    }

    case "SEND_GROUP_MESSAGE": {
      const { groupId, text, senderName, senderAvatar } = action;
      const newMsg = {
        id: `gmsg_${Date.now()}`,
        senderId: CURRENT_USER_ID,
        senderName: senderName || "You",
        senderAvatar: senderAvatar || CURRENT_USER.avatar,
        text,
        timestamp: new Date(),
        type: "text",
      };
      const updatedGroupMessages = {
        ...state.groupMessages,
        [groupId]: [...(state.groupMessages[groupId] || []), newMsg],
      };
      const updatedGroups = state.groups.map((g) =>
        g.id === groupId
          ? { ...g, lastMessage: { text, senderName: "You", timestamp: new Date(), isFromMe: true }, unreadCount: 0 }
          : g
      );
      return { ...state, groupMessages: updatedGroupMessages, groups: updatedGroups };
    }

    case "MARK_READ": {
      const { conversationId } = action;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ),
      };
    }

    case "MARK_GROUP_READ": {
      const { groupId } = action;
      return {
        ...state,
        groups: state.groups.map((g) => (g.id === groupId ? { ...g, unreadCount: 0 } : g)),
      };
    }

    case "START_CONVERSATION": {
      const { participantId, newId } = action;
      const exists = state.conversations.find((c) => c.participantId === participantId);
      if (exists) return state;
      const newConv = {
        id: newId,
        participantId,
        lastMessage: null,
        unreadCount: 0,
      };
      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        messages: { ...state.messages, [newId]: [] },
      };
    }

    default:
      return state;
  }
}

export function MessagingProvider({ children }) {
  const [state, dispatch] = useReducer(messagingReducer, initialState);

  const totalUnread =
    state.conversations.reduce((sum, c) => sum + c.unreadCount, 0) +
    state.groups.reduce((sum, g) => sum + g.unreadCount, 0);

  const sendMessage = useCallback((conversationId, text) => {
    dispatch({ type: "SEND_MESSAGE", conversationId, text });
  }, []);

  const sendGroupMessage = useCallback((groupId, text, senderName, senderAvatar) => {
    dispatch({ type: "SEND_GROUP_MESSAGE", groupId, text, senderName, senderAvatar });
  }, []);

  const markRead = useCallback((conversationId) => {
    dispatch({ type: "MARK_READ", conversationId });
  }, []);

  const markGroupRead = useCallback((groupId) => {
    dispatch({ type: "MARK_GROUP_READ", groupId });
  }, []);

  /**
   * Gets existing conversation ID for a participant, or creates a new one.
   * Returns the conversation ID immediately (deterministic).
   */
  const getOrCreateConversationId = useCallback(
    (participantId) => {
      const existing = state.conversations.find((c) => c.participantId === participantId);
      if (existing) return existing.id;
      const newId = `conv_${participantId}`;
      dispatch({ type: "START_CONVERSATION", participantId, newId });
      return newId;
    },
    [state.conversations]
  );

  /**
   * Find a contact by their handle (e.g. "@sahil_khan")
   */
  const getContactByHandle = useCallback(
    (handle) => Object.values(state.contacts).find((c) => c.handle === handle),
    [state.contacts]
  );

  return (
    <MessagingContext.Provider
      value={{
        ...state,
        totalUnread,
        sendMessage,
        sendGroupMessage,
        markRead,
        markGroupRead,
        getOrCreateConversationId,
        getContactByHandle,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error("useMessaging must be used within MessagingProvider");
  return ctx;
}
