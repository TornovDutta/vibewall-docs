import React from 'react'
import SubFeatures from './SubFeatures'

function Features({ SectionHeading, features }) {
  return (
    <section id="features" className="space-y-10">
      <SectionHeading
        label="CORE_CAPABILITIES"
        title="Production-Grade System Features"
        description="Every security, moderation, and privacy feature engineered from scratch for high performance and resilience."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <SubFeatures
            key={index}
            item={feature}
          />
        ))}
      </div>
    </section>
  )
}

export default Features