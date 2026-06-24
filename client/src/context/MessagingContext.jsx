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
import { sendMessageToAgent } from "../api/aiChatApi";

const MessagingContext = createContext(null);

const initialState = {
  conversations: mockConversations,
  messages: mockMessages,
  groups: mockGroups,
  groupMessages: mockGroupMessages,
  contacts: mockContacts,
  typingConversations: {}, // { [conversationId]: true | false }
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

    case "RECEIVE_AI_MESSAGE": {
      const { conversationId, text, senderId, isPlan } = action;
      const newMsg = {
        id: `ai_${Date.now()}`,
        senderId,
        text,
        timestamp: new Date(),
        type: "text",
        isAI: true,
        isPlan: isPlan === true,
      };
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMsg],
      };
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { text: isPlan ? "📄 Fitness Plan Ready — tap to download" : text.slice(0, 60) + (text.length > 60 ? "…" : ""), timestamp: new Date(), isFromMe: false }, unreadCount: 0 }
          : c
      );
      return { ...state, messages: updatedMessages, conversations: updatedConversations };
    }

    case "SET_TYPING": {
      const { conversationId, isTyping } = action;
      return {
        ...state,
        typingConversations: { ...state.typingConversations, [conversationId]: isTyping },
      };
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

  /**
   * Send a message to an AI agent conversation.
   * 1. Optimistically adds user message
   * 2. Sets typing indicator
   * 3. Calls Groq via chat-service
   * 4. Dispatches AI reply
   */
  const sendAIMessage = useCallback(async (conversationId, text, agentId, conversationHistory) => {
    // 1. Add user message immediately
    dispatch({ type: "SEND_MESSAGE", conversationId, text });

    // 2. Show typing indicator
    dispatch({ type: "SET_TYPING", conversationId, isTyping: true });

    try {
      // 3. Build messages history for context
      const messages = [
        ...conversationHistory.map((msg) => ({
          role: msg.senderId === CURRENT_USER_ID ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: text },
      ];

      const data = await sendMessageToAgent(agentId, messages);

      // 4. Dispatch AI reply
      dispatch({
        type: "RECEIVE_AI_MESSAGE",
        conversationId,
        text: data.reply,
        senderId: agentId,
        isPlan: data.isPlan === true,
      });
    } catch (err) {
      console.error("AI message failed:", err);
      dispatch({
        type: "RECEIVE_AI_MESSAGE",
        conversationId,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
        senderId: agentId,
      });
    } finally {
      // 5. Clear typing indicator
      dispatch({ type: "SET_TYPING", conversationId, isTyping: false });
    }
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
        sendAIMessage,
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
