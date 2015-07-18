// Binary Search Tree JS implentation
//compare(A,B):
//	Returns true if A is more than B (A>B) else return false
function BST (compare) {
	this.comp = compare;
	this.root = null;
	this.length = 0;
}

function Node(data_in, left_in, right_in) {
	this.data = data_in;
	this.left = left_in;
	this.right = right_in;
}

BST.prototype.insert = function(data_in) {
	//console.log("inserting "+data_in);
	if(this.root == null) {
		this.root = new Node(data_in, null, null);
		this.length++;
	} else {
		var ptr = this.root;
		while (true) {
			if(this.comp(ptr.data, data_in)) {
				//console.log("a is older than b");
				if(ptr.left) ptr = ptr.left;
				else {
					ptr.left = new Node(data_in, null, null);
					this.length++;
					break;
				}
			} else if (this.comp(data_in, ptr.data)) {
				//console.log("b is older than a");
				if(ptr.right) ptr = ptr.right;
				else {
					ptr.right = new Node(data_in, null, null);
					this.length++;
					break;
				}
			} else {
				//console.log("found equal");
				//data_in is equal to a known node!
				//don't insert a duplicate
				break;
			}
		}
	}
};

BST.prototype.doOp = function(callback) {
	if(this.root == null) return;
	else this.traverseInOrder(this.root, callback);
}

BST.prototype.traverseInOrder = function (node, callback) {
	if(node == null) return;
	this.traverseInOrder(node.left, callback);
	if(callback) node.data = callback(node.data);
	else console.log(node.data);
	this.traverseInOrder(node.right, callback);
	return;
}

