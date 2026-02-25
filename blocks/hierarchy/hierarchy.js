export default function decorate(block) {
  block.innerHTML = `
    <section class="org-page">

      <div class="org-header">
        <h1>Organization Hierarchy</h1>
        <p>View the organizational structure and reporting lines</p>
      </div>

      <div class="org-chart">

        <!-- LEVEL 1 : CEO -->
        <div class="level level-1">
          <div class="card ceo">
            <div class="card-top red">
              <div class="avatar">M</div>
              <div>
                <div class="name">Michael Chen</div>
                <div class="role">Chief Executive Officer</div>
              </div>
            </div>
            <div class="card-body">
              <div>📧 michael.chen@adobe.com</div>
              <div>📞 +1 (555) 001-0001</div>
            </div>
          </div>
        </div>

        <!-- CONNECTOR -->
        <div class="v-line"></div>

        <!-- LEVEL 2 : CXOs -->
        <div class="level level-2">
          <div class="h-line"></div>

          <div class="card">
            <div class="card-top light">
              <div class="avatar">S</div>
              <div>
                <div class="name">Sarah Johnson</div>
                <div class="role">Chief Technology Officer</div>
              </div>
            </div>
            <div class="card-body">
              <div>Engineering</div>
              <div>📧 sarah.johnson@adobe.com</div>
            </div>
          </div>

          <div class="card">
            <div class="card-top light">
              <div class="avatar">E</div>
              <div>
                <div class="name">Emily Davis</div>
                <div class="role">Chief Marketing Officer</div>
              </div>
            </div>
            <div class="card-body">
              <div>Marketing</div>
              <div>📧 emily.davis@adobe.com</div>
            </div>
          </div>

          <div class="card">
            <div class="card-top light">
              <div class="avatar">L</div>
              <div>
                <div class="name">Lisa Anderson</div>
                <div class="role">Chief HR Officer</div>
              </div>
            </div>
            <div class="card-body">
              <div>Human Resources</div>
              <div>📧 lisa.anderson@adobe.com</div>
            </div>
          </div>
        </div>

        <!-- CONNECTOR -->
        <div class="v-line"></div>

        <!-- LEVEL 3 : MANAGERS -->
        <div class="level level-3">
          <div class="h-line"></div>

          <div class="card small">
            <div class="name">David Martinez</div>
            <div class="role">Engineering Manager</div>
          </div>

          <div class="card small">
            <div class="name">James Wilson</div>
            <div class="role">Marketing Manager</div>
          </div>

          <div class="card small">
            <div class="name">Robert Taylor</div>
            <div class="role">HR Manager</div>
          </div>
        </div>

      </div>
    </section>
  `;
}