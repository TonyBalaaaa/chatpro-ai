import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { USER_PLANS } from '@/config/chatConfig';

const PlanContext = createContext(null);

const planOrder = ['FREE', 'PLUS', 'PRO', 'INTERPLASE'];

export const PlanProvider = ({ children }) => {
  const [currentPlanName, setCurrentPlanName] = useState(() => {
    return localStorage.getItem('chatpro_current_plan_name') || 'FREE';
  });
  const [currentPlan, setCurrentPlan] = useState(USER_PLANS[currentPlanName]);
  const [features, setFeatures] = useState(USER_PLANS[currentPlanName]?.features || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const plan = USER_PLANS[currentPlanName];
    if (plan) {
      setCurrentPlan(plan);
      setFeatures(plan.features);
      localStorage.setItem('chatpro_current_plan_name', currentPlanName);
    } else {
      // Fallback to FREE if stored plan is invalid
      setCurrentPlanName('FREE');
      setCurrentPlan(USER_PLANS.FREE);
      setFeatures(USER_PLANS.FREE.features);
      localStorage.setItem('chatpro_current_plan_name', 'FREE');
    }
    setLoading(false);
  }, [currentPlanName]);

  const cyclePlan = useCallback(() => {
    const currentIndex = planOrder.indexOf(currentPlanName);
    const nextIndex = (currentIndex + 1) % planOrder.length;
    setCurrentPlanName(planOrder[nextIndex]);
  }, [currentPlanName]);

  const setPlan = useCallback((planName) => {
    if (USER_PLANS[planName]) {
      setCurrentPlanName(planName);
    } else {
      console.warn(`Attempted to set invalid plan: ${planName}`);
    }
  }, []);


  const value = {
    currentPlan,
    currentPlanName,
    features,
    loading,
    cyclePlan,
    setPlan,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};