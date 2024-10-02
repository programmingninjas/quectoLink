# QuectoLink - Scalable and Distributed URL Shortener Service
![quectoLink](https://github.com/user-attachments/assets/6b400836-9274-4cb9-b219-07b34358b8bb)
QuectoLink is a scalable and distributed URL shortener service that allows users to shorten long URLs into more manageable and shareable links. The name "Quecto" is derived from the term for the smallest unit in the metric system, reflecting the service's ability to efficiently shorten URLs.

## Features

- Shorten long URLs into concise and manageable links.
- Scalable architecture to handle large volumes of URL shortening requests.
- Distributed system for high availability and fault tolerance.
- Utilizes MERN stack (MongoDB, Express.js, React.js, Node.js) for web application development.
- Integration with Redis for caching and performance optimization.
- Utilizes ZooKeeper for distributed coordination and consensus.
- Nginx used for load balancing to distribute incoming traffic across multiple servers.
- **Kubernetes integration** for scaling and managing the containerized application in a production environment.
- Containerized with Docker for easy deployment and scalability.
- Implemented GitHub Actions for automatic deployment to virtual machines upon code changes, ensuring continuous integration and delivery.

## Technologies Used

- **MERN Stack:** MongoDB, Express.js, React.js, Node.js - for web application development.
- **Redis:** In-memory data structure store used for caching frequently accessed data.
- **ZooKeeper:** Distributed coordination service for maintaining configuration information, naming, and providing distributed synchronization.
- **Nginx:** High-performance web server and reverse proxy for load balancing.
- **Kubernetes:** Used for managing and scaling containerized services in production environments.
- **Docker:** Containerization platform for packaging the application and its dependencies into standardized units for deployment.
- **GitHub Actions:** Automated workflow tool integrated with GitHub repository for continuous integration and deployment, ensuring seamless deployment to virtual machines upon code changes.

---

## Getting Started

I will walk you through setting up QuectoLink. We'll cover how to set up the project using **npm**, containerize it with **Docker**, and deploy it on **Kubernetes** using various tools like **kubeadm**, **k3s**, and **k3d (Windows)**.

## Table of Contents
1. [Setting Up QuectoLink with npm](#setting-up-quectolink-with-npm)
2. [Dockerizing QuectoLink](#dockerizing-quectolink)
3. [Deploying with Kubernetes](#deploying-with-kubernetes)
   - [Using kubeadm](#using-kubeadm)
   - [Using k3s](#using-k3s)
   - [Using k3d](#using-k3d)
4. [Conclusion](#conclusion)
5. [References](#references)

---

## Setting Up QuectoLink with npm

To get started with QuectoLink locally using npm:

### Prerequisites
- Node.js and npm installed on your machine.

### Steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/programmingninjas/quectolink.git
    ```

2. Navigate to the project directory:

    ```bash
    cd quectolink
    ```

3. Install dependencies in backend and frontend folder:

    ```bash
    npm install
    ```

4. Update the environment variables in a `.env` file of backend folder:

    ```bash
    MONGO_URI=mongodb://localhost:27017/your_db_name
    PORT=5000
    JWT_SECRET=your_jwt_secret
    ```

5. Start the backend:

    ```bash
    npm run server
    ```

6. Start the frontend:

    ```bash
    npm run dev
    ```

7. Open your browser and go to `http://localhost:3000`.

---

## Dockerizing QuectoLink

### Prerequisites
- Docker and Docker Compose installed.

### Steps:

1. **Build Docker images for the frontend and backend:**

    Navigate to the respective directories and build the images using the provided Dockerfiles.

    For the **backend**:

    ```bash
    cd backend
    docker build -t quectolink-backend .
    ```

    For the **frontend**:

    ```bash
    cd frontend
    docker build -t quectolink-frontend .
    ```

2. **Update your `docker-compose.yml` file** to reference the newly built images:

### Updated `docker-compose.yml`:

```yaml
    services:
      frontend:
        image: quectolink-frontend
        ports:
          - "3000:3000"
        depends_on:
          - backend
    
      backend:
        image: quectolink-backend
        ports:
          - "5000:5000"
        environment:
          - MONGO_URI=mongodb://mongo:27017/your_db_name
          - JWT_SECRET=your_jwt_secret
          - PORT=5000
        depends_on:
          - mongo
          - zookeeper
          - cache
    
      mongo:
        image: mongo
        ports:
          - "27017:27017"
        volumes:
          - mongo-data:/data/db
    
      cache:
        image: redis:alpine
        ports:
          - "6379:6379"
    
      zookeeper:
        image: zookeeper
        ports:
          - "2181:2181"
    
    volumes:
      mongo-data:
```

3. **Run `docker-compose` to start all services in detached mode**:

    ```bash
    docker compose up -d
    ```

4. **Check running containers** to ensure everything is working properly:

    ```bash
    docker ps
    ```

5. **Access the application** in your browser at `http://localhost:3000`.

---

## Deploying with Kubernetes

Now let’s deploy QuectoLink in a Kubernetes cluster. We’ll cover kubeadm, k3s, and k3d for different environments.

### Using kubeadm

kubeadm is a tool to bootstrap a Kubernetes cluster.

### Prerequisites:
- A system with multiple nodes.

### Steps:

### Step 1: SSH into the Master Server
SSH into your Master server using the following command (replace the placeholders with your actual values):

```bash
ssh -i "your-key.pem" user@<MASTER-IP>
```

### Step 2: Disable Swap
Disable the swap to ensure optimal Kubernetes performance.

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

### Step 3: Forward IPv4 and Enable iptables for Bridged Traffic

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

Configure sysctl parameters for Kubernetes networking:

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply the sysctl parameters without rebooting
sudo sysctl --system
```

Verify that the necessary kernel modules and system variables are set:

```bash
lsmod | grep br_netfilter
lsmod | grep overlay

sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

### Step 4: Install Container Runtime (containerd)
Install and configure **containerd** as the container runtime for Kubernetes. (Always use latest stable release)

```bash
# Download and install containerd
curl -LO https://github.com/containerd/containerd/releases/download/v1.7.14/containerd-1.7.14-linux-amd64.tar.gz
sudo tar Cxzvf /usr/local containerd-1.7.14-linux-amd64.tar.gz

# Setup containerd as a systemd service
curl -LO https://raw.githubusercontent.com/containerd/containerd/main/containerd.service
sudo mkdir -p /usr/local/lib/systemd/system/
sudo mv containerd.service /usr/local/lib/systemd/system/

# Configure containerd and enable systemd cgroups
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml

# Start containerd
sudo systemctl daemon-reload
sudo systemctl enable --now containerd

# Verify containerd service
systemctl status containerd
```

### Step 5: Install `runc`
Install `runc`, a low-level container runtime:

```bash
curl -LO https://github.com/opencontainers/runc/releases/download/v1.1.12/runc.amd64
sudo install -m 755 runc.amd64 /usr/local/sbin/runc
```

### Step 6: Install CNI Plugins
Install the **CNI (Container Network Interface)** plugins:

```bash
curl -LO https://github.com/containernetworking/plugins/releases/download/v1.5.0/cni-plugins-linux-amd64-v1.5.0.tgz
sudo mkdir -p /opt/cni/bin
sudo tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.5.0.tgz
```

### Step 7: Install `kubeadm`, `kubelet`, and `kubectl`
Install Kubernetes components using version `1.29` to allow for later upgrades:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

# Add the Kubernetes package repository
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install kubeadm, kubelet, and kubectl
sudo apt-get update
sudo apt-get install -y kubelet=1.29.6-1.1 kubeadm=1.29.6-1.1 kubectl=1.29.6-1.1 --allow-downgrades --allow-change-held-packages
sudo apt-mark hold kubelet kubeadm kubectl
```

Check the installed versions:

```bash
kubeadm version
kubelet --version
kubectl version --client
```

### Step 8: Configure `crictl` to Work with `containerd`
To configure **crictl** to work with `containerd`:

```bash
sudo crictl config runtime-endpoint unix:///var/run/containerd/containerd.sock
```

### Step 9: Initialize the Control Plane

To initialize the Kubernetes control plane with **Flannel's** default subnet for pod networking, use the following command on the **master node**. Be sure to replace `<Master-IP>` with the **Private IP address** of the master node:

```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=<Master-IP> --node-name master
```

- **Note:** Ensure that your worker nodes are on the **same subnet** as the master node, or connected via a router if they are in different subnets. If you want to advertise it over a **public IP** (e.g., for a multi-region setup), you would use the public IP by adding ``` --control-plane-endpoint "PUBLIC_IP:PORT" ```.

After the command completes, you will receive an output containing a join command for worker nodes. **Save this command** for later use when adding worker nodes. If you forget to you can use:

```bash
kubeadm token create --print-join-command
```

### Step 10: Configure Kubeconfig for `kubectl`
Prepare the kubeconfig file for `kubectl`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Step 11: Add Flannel CNI
```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml
```

### Step 12: Add ingress-nginx controller
```bash
helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --create-namespace
```

## Setting Up Kubernetes Worker Node

### Step 1: SSH into the Worker Server

```bash
ssh -i "your-key.pem" user@<WORKER-IP>
```

### Step 2-8: Repeat the same steps as on the master node:

1. **Disable Swap**
2. **Forward IPv4 and Enable iptables for Bridged Traffic**
3. **Install Container Runtime (containerd)**
4. **Install runc**
5. **Install CNI Plugins**
6. **Install `kubeadm`, `kubelet`, and `kubectl`**
7. **Configure `crictl` to work with `containerd`**

Refer to the steps from the master node setup for detailed commands.

---

### Step 9: Join the Worker Node to the Master

Once the worker node is configured, join it to the master using the token received after running `kubeadm init` on the master node. Run the following command on the worker node (replace `<TOKEN>` and `<MASTER-IP>` with the values you saved):

```bash
sudo kubeadm join <MASTER-IP>:6443 --token <TOKEN> --discovery-token-ca-cert-hash sha256:<HASH>
```

After this, the worker node will join the cluster and the master will start managing it. You can verify the setup from the master node using:

```bash
kubectl get nodes
```

This will display all the nodes in your Kubernetes cluster.

---

### Using k3s

k3s is a lightweight Kubernetes distribution.

### Prerequisites:
- k3s installed.

### Steps:

1. Install k3s:

    ```bash
    curl -sfL https://get.k3s.io | sh -
    ```

2. Use kubectl without sudo:

    ```bash
    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
    ```

3. Apply all the Yamls

---

### Using k3d (Windows)

k3d is a tool to run k3s clusters inside Docker containers.

### Prerequisites:
- Docker Desktop installed.

### Steps:

1. Install k3d using Chocolatey:

    ```bash
    choco install k3d
    ```

1. Create a k3d cluster:

    ```bash
    k3d cluster create mycluster --servers 1 --agents 2
    ```

3. Apply all the Yamls

---

## Conclusion

QuectoLink is a powerful, scalable URL shortener service that can be easily set up using npm, Docker, and Kubernetes. Whether you're deploying locally or in a production environment, the flexibility of QuectoLink ensures a smooth and efficient deployment process.
While using the local environment if you don't have the Public I.P you can use kubectl port-forwarding to port forward ingress port to your local machine or patch a service using type NodePort.

---

## References

1. [System Design for URL Shortening](https://systemdesign.one/url-shortening-system-design)
2. [How URL Shorteners Work](https://youtu.be/JQDHz72OA3c?si=flg2FZ2JtMkwP6TW)
3. [kubeadm Documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
4. [k3s Documentation](https://rancher.com/docs/k3s/latest/en/)
5. [k3d Documentation](https://k3d.io/v5.0.1/)
